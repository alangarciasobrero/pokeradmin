import { Request, Response } from 'express';
import CashGameRepository from '../repositories/CashGameRepository';
import Payment from '../models/Payment';
import User from '../models/User';

export async function renderCloseForm(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).send('Cash game no encontrado');
    res.render('admin/cash_close', { cash, username: req.session?.username });
  } catch (err) {
    console.error('Error rendering close form', err);
    res.status(500).send('Error');
  }
}

export async function handleClosePost(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).send('Cash game no encontrado');

    // Inputs from form (fallback to existing values)
    const total_commission = req.body.total_commission !== undefined ? Number(req.body.total_commission) : Number(cash.total_commission || 0);
    const total_tips = req.body.total_tips !== undefined ? Number(req.body.total_tips) : Number(cash.total_tips || 0);
    const dealer_user_id = req.body.dealer_user_id ? Number(req.body.dealer_user_id) : null;

    // Mark cash game closed
    await CashGameRepository.update(id, { end_datetime: new Date(), total_commission, total_tips } as any);

    // Create payment for commission (recorded as an admin/system payment)
    // Use the acting admin's user_id if present, otherwise fallback to 1
    const systemUserId = req.session?.userId ? Number(req.session.userId) : 1;
    if (total_commission && total_commission > 0) {
  const methodWithActor = req.session && req.session.username ? `commission|by:${req.session.username}:${req.session.userId}` : 'commission';
  const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
  await Payment.create({ user_id: systemUserId, amount: Number(total_commission), payment_date: new Date(), source: 'cash_commission', reference_id: id, paid: true, paid_amount: Number(total_commission), method: methodWithActor, personal_account: false, recorded_by_name: recordedByName });
    }

    // Create payment for dealer tips (credit to dealer)
    if (dealer_user_id && total_tips && total_tips > 0) {
  const methodWithActor = req.session && req.session.username ? `tips|by:${req.session.username}:${req.session.userId}` : 'tips';
  const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
  await Payment.create({ user_id: dealer_user_id, amount: Number(total_tips), payment_date: new Date(), source: 'cash_tips', reference_id: id, paid: true, paid_amount: Number(total_tips), method: methodWithActor, personal_account: false, recorded_by_name: recordedByName });
    }

    req.session!.flash = { type: 'success', message: 'Mesa cerrada y pagos registrados' };
    res.redirect(`/admin/games/cash/${id}`);
  } catch (err) {
    console.error('Error closing cash game', err);
    res.status(500).send('Error cerrando mesa');
  }
}

export async function renderBulkClose(req: Request, res: Response) {
  try {
    const q = req.query.date as string | undefined;
    const date = q ? new Date(q) : new Date();
    const openGames = await CashGameRepository.findOpenByDate(date);

    // aggregate totals by dealer name
    const perDealer: Record<string, { games: number; total_commission: number; total_tips: number; ids: number[] }> = {};
    openGames.forEach((g: any) => {
      const dealer = g.dealer || '—';
      if (!perDealer[dealer]) perDealer[dealer] = { games: 0, total_commission: 0, total_tips: 0, ids: [] };
      perDealer[dealer].games += 1;
      perDealer[dealer].total_commission += Number(g.total_commission || 0);
      perDealer[dealer].total_tips += Number(g.total_tips || 0);
      perDealer[dealer].ids.push(g.id);
    });

    res.render('admin/cash_bulk_close', { date, openGames, perDealer });
  } catch (err) {
    console.error('Error rendering bulk close', err);
    res.status(500).send('Error');
  }
}

export async function handleBulkClosePost(req: Request, res: Response) {
  try {
    const q = req.body.date as string | undefined || req.query.date as string | undefined;
    const date = q ? new Date(q) : new Date();
    const openGames = await CashGameRepository.findOpenByDate(date);

    if (!openGames || openGames.length === 0) return res.redirect('/admin/games/cash/list');

    // aggregate across open games
    const totals = openGames.reduce((acc: any, g: any) => {
      acc.total_commission += Number(g.total_commission || 0);
      acc.total_tips += Number(g.total_tips || 0);
      acc.games.push(g.id);
      if (!acc.byDealer[g.dealer || '—']) acc.byDealer[g.dealer || '—'] = { total_commission: 0, total_tips: 0, ids: [] };
      acc.byDealer[g.dealer || '—'].total_commission += Number(g.total_commission || 0);
      acc.byDealer[g.dealer || '—'].total_tips += Number(g.total_tips || 0);
      acc.byDealer[g.dealer || '—'].ids.push(g.id);
      return acc;
    }, { total_commission: 0, total_tips: 0, games: [] as number[], byDealer: {} as Record<string, any> });

    // Close each game and register payments: commission to system user, tips to dealer (if matched to a user)
    const systemUserId = req.session?.userId ? Number(req.session.userId) : 1;

    // Close games
    for (const g of openGames) {
      await CashGameRepository.update(g.id, { end_datetime: new Date() } as any);
    }

    // Register aggregated commission as a single payment
    if (totals.total_commission > 0) {
  const methodWithActor = req.session && req.session.username ? `commission_bulk|by:${req.session.username}:${req.session.userId}` : 'commission_bulk';
  const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
  await Payment.create({ user_id: systemUserId, amount: Number(totals.total_commission), payment_date: new Date(), source: 'cash_commission_bulk', paid: true, paid_amount: Number(totals.total_commission), method: methodWithActor, personal_account: false, recorded_by_name: recordedByName });
    }

    // For each dealer aggregate tips and attempt to credit to matching user by username; fallback to system user but mark as unassigned
    for (const dealerName of Object.keys(totals.byDealer)) {
      const dealerTotals = totals.byDealer[dealerName];
      if (dealerTotals.total_tips <= 0) continue;
      let userIdToCredit = systemUserId;
      if (dealerName && dealerName !== '—') {
        const user = await User.findOne({ where: { username: dealerName } });
        if (user) userIdToCredit = user.id;
      }
      const source = userIdToCredit === systemUserId && dealerName !== '—' ? 'cash_tips_unassigned' : 'cash_tips';
      const method = userIdToCredit === systemUserId && dealerName !== '—' ? `tips_unassigned:${dealerName}` : 'tips_bulk';
  const methodWithActor = req.session && req.session.username ? `${method}|by:${req.session.username}:${req.session.userId}` : method;
      const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
      await Payment.create({ user_id: userIdToCredit, amount: Number(dealerTotals.total_tips), payment_date: new Date(), source, paid: true, paid_amount: Number(dealerTotals.total_tips), method: methodWithActor, personal_account: false, recorded_by_name: recordedByName });
    }

    req.session!.flash = { type: 'success', message: 'Mesas cerradas y pagos agregados por repartidor' };
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error('Error handling bulk close', err);
    res.status(500).send('Error cerrando mesas en lote');
  }
}

export async function renderTotals(req: Request, res: Response) {
  try {
    const q = req.query.date as string | undefined;
    const date = q ? new Date(q) : new Date();
    const games = await CashGameRepository.findByDate(date);

    // aggregate totals by dealer
    const perDealer: Record<string, { games: number; total_commission: number; total_tips: number }> = {};
    games.forEach((g: any) => {
      const dealer = g.dealer || '—';
      if (!perDealer[dealer]) perDealer[dealer] = { games: 0, total_commission: 0, total_tips: 0 };
      perDealer[dealer].games += 1;
      perDealer[dealer].total_commission += Number(g.total_commission || 0);
      perDealer[dealer].total_tips += Number(g.total_tips || 0);
    });

    res.render('admin/cash_totals', { date, perDealer, games });
  } catch (err) {
    console.error('Error rendering totals', err);
    res.status(500).send('Error');
  }
}

export async function exportTotalsCSV(req: Request, res: Response) {
  try {
    const q = req.query.date as string | undefined;
    const date = q ? new Date(q) : new Date();
    const games = await CashGameRepository.findByDate(date);

    const perDealer: Record<string, { games: number; total_commission: number; total_tips: number }> = {};
    games.forEach((g: any) => {
      const dealer = g.dealer || '—';
      if (!perDealer[dealer]) perDealer[dealer] = { games: 0, total_commission: 0, total_tips: 0 };
      perDealer[dealer].games += 1;
      perDealer[dealer].total_commission += Number(g.total_commission || 0);
      perDealer[dealer].total_tips += Number(g.total_tips || 0);
    });

    // Build CSV
    const header = ['dealer', 'games', 'total_commission', 'total_tips'];
    const rows = Object.keys(perDealer).map(d => {
      const v = perDealer[d];
      return [d, String(v.games), String(v.total_commission.toFixed(2)), String(v.total_tips.toFixed(2))];
    });
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');

    const filename = `cash_totals_${date.toISOString().slice(0,10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    console.error('Error exporting totals CSV', err);
    res.status(500).send('Error');
  }
}
