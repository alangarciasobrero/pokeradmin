$base = 'http://localhost:3000'
$sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Helper: POST JSON with Invoke-RestMethod and return parsed body; on error return hasError + details
function Post-Json([string]$url, [object]$body, [Microsoft.PowerShell.Commands.WebRequestSession]$session) {
  $json = $body | ConvertTo-Json -Depth 6
  try {
    $resp = Invoke-RestMethod -Uri $url -Method Post -Body $json -WebSession $session -ContentType 'application/json' -TimeoutSec 15
    return @{ ok = $true; body = $resp }
  } catch {
    $details = ''
    if ($_.Exception.Response) {
      $r = $_.Exception.Response
      try { $sr = New-Object IO.StreamReader($r.GetResponseStream()); $details = $sr.ReadToEnd() } catch { $details = $_.Exception.Message }
      return @{ ok = $false; status = $r.StatusCode.Value__; details = $details }
    } else {
      return @{ ok = $false; status = 0; details = $_.Exception.Message }
    }
  }
}
try {
  $r = Invoke-WebRequest -Uri "$base/dev/login-admin" -WebSession $sess -UseBasicParsing -TimeoutSec 10
  Write-Output "DEV LOGIN -> $($r.StatusCode)"
} catch {
  Write-Output "DEV LOGIN failed: $($_.Exception.Message)"
  exit 1
}

# Create tournament
$tourney = @{
  tournament_name = "E2E Test Tournament " + ([datetime]::UtcNow.ToString('yyyyMMddHHmmss'))
  start_date = (Get-Date).ToString('s')
  buy_in = 100
  re_entry = 0
  knockout_bounty = 0
  starting_stack = 10000
  count_to_ranking = $true
  double_points = $false
  blind_levels = 10
  small_blind = 50
  punctuality_discount = 0
}
Write-Output "Creating tournament..."
$resT = Post-Json "$base/api/tournaments" $tourney $sess
if (-not $resT.ok) {
  Write-Output "CREATE TOURN failed status: $($resT.status)"
  Write-Output $resT.details
  exit 1
}
$tobj = $resT.body
$tid = $tobj.id
Write-Output "CREATE TOURN -> id: $tid"

# create users
$users = @()
for ($i=1; $i -le 3; $i++) {
  $u = @{
    username = "e2e_user_${i}_" + ([datetime]::UtcNow.ToString('HHmmss'))
    password = "pass1234"
    full_name = "E2E User $i"
    role = 'user'
  }
  try {
    $resU = Post-Json "$base/api/users" $u $sess
    if (-not $resU.ok) {
      Write-Output "CREATE USER $i failed status: $($resU.status)"
      Write-Output $resU.details
      exit 1
    }
    Write-Output "CREATE USER $i -> ok"
    $users += $resU.body
  } catch {
    if ($_.Exception.Response) {
      $resp = $_.Exception.Response
      $sr = New-Object IO.StreamReader($resp.GetResponseStream())
      Write-Output "CREATE USER Status: $($resp.StatusCode.Value__)"
      Write-Output $sr.ReadToEnd()
    } else {
      Write-Output "CREATE USER failed: $($_.Exception.Message)"
    }
    exit 1
  }
}
Write-Output "Created users: $($users | ConvertTo-Json)"

# create registrations
$regs = @()
foreach ($u in $users) {
  # ensure players row exists for legacy FK compatibility (dev helper)
  try {
    $ens = Invoke-RestMethod -Uri "$base/dev/ensure-player/$($u.id)" -Method Post -WebSession $sess -TimeoutSec 10
    Write-Output "ENSURE-PLAYER for $($u.id): $($ens | ConvertTo-Json -Depth 3)"
  } catch {
    Write-Output "ENSURE-PLAYER failed for $($u.id): $($_.Exception.Message)"
  }
  $body = @{ user_id = $u.id; tournament_id = $tid; punctuality = $true }
  $resR = Post-Json "$base/api/registrations" $body $sess
  if (-not $resR.ok) {
    Write-Output "CREATE REG for user $($u.id) failed status: $($resR.status)"
    Write-Output $resR.details
    exit 1
  }
  Write-Output "CREATE REG for user $($u.id) -> ok"
  $regs += $resR.body
}
Write-Output "Registrations: $($regs | ConvertTo-Json)"

# create results
$results = @()
$pos = 1
foreach ($u in $users) {
  $b = @{ tournament_id = $tid; user_id = $u.id; position = $pos; final_table = $true }
  $resRes = Post-Json "$base/api/results" $b $sess
  if (-not $resRes.ok) {
    Write-Output "CREATE RESULT for user $($u.id) pos $pos failed status: $($resRes.status)"
    Write-Output $resRes.details
    exit 1
  }
  Write-Output "CREATE RESULT for user $($u.id) pos $pos -> ok"
  $results += $resRes.body
  $pos++
}
Write-Output "Results: $($results | ConvertTo-Json)"

# fetch ranking
try {
  $rR = Invoke-WebRequest -Uri "$base/admin/games/ranking" -WebSession $sess -UseBasicParsing -TimeoutSec 15
  Write-Output "GET /admin/games/ranking -> $($rR.StatusCode)"
  $content = $rR.Content
  $snippet = if ($content.Length -gt 1200) { $content.Substring(0,1200) + '... [truncated]' } else { $content }
  Write-Output $snippet
} catch {
  Write-Output "GET ranking failed: $($_.Exception.Message)"
  exit 1
}

Write-Output 'E2E flow completed'
