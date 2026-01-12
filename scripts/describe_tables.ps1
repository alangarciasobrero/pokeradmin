$tables = @('cash_games','cash_participants','historical_points','payments','players','ranking_history','registrations','results','seasons','tournament_points','tournaments','users')
foreach ($t in $tables) {
    Write-Output "---TABLE: $t"
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:3000/dev/debug/describe/$t" -Method GET -UseBasicParsing
        $out = @{ table = $t; columns = $res.columns }
        $out | ConvertTo-Json -Depth 5
    } catch {
        Write-Output ("ERROR describing {0}: {1}" -f $t, $_.Exception.Message)
    }
    Write-Output "" # blank line
}
