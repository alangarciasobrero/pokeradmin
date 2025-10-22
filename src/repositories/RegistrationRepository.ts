// Repositorio para la entidad Registration
// Encapsula la lógica de acceso a datos y operaciones sobre inscripciones
import { Registration } from '../models/Registration';

/**
 * Clase RegistrationRepository
 * Proporciona métodos para interactuar con la tabla de inscripciones
 */
export class RegistrationRepository {
  /**
   * Obtiene todas las inscripciones
   */
  async getAll(): Promise<Registration[]> {
    try {
      return await Registration.findAll();
    } catch (err: any) {
      // Fallback for legacy schema where column might be `player_id` instead of `user_id`
      if (err && err.parent && err.parent.errno === 1054) {
        const sequelize = (Registration as any).sequelize;
        const rows: any[] = await sequelize.query('SELECT id, player_id as user_id, tournament_id, registration_date, punctuality FROM registrations', { type: (sequelize as any).QueryTypes.SELECT });
        // Map raw rows to Registration-like objects (lightweight)
        return rows.map(r => (Registration.build ? Registration.build(r) : r));
      }
      throw err;
    }
  }

  /**
   * Obtiene inscripciones paginadas con contador y filtros opcionales
   */
  async getPaginated(options: { page?: number; perPage?: number; where?: any } = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const perPage = Math.min(200, Math.max(5, Number(options.perPage) || 20));
    const offset = (page - 1) * perPage;

    try {
      const result = await Registration.findAndCountAll({
        where: options.where || {},
        limit: perPage,
        offset,
        order: [['registration_date', 'DESC']]
      });
      return {
        rows: result.rows,
        count: Number(result.count),
        page,
        perPage
      };
    } catch (err: any) {
      // If column user_id missing, fallback to raw query and implement pagination manually
      if (err && err.parent && err.parent.errno === 1054) {
        const sequelize = (Registration as any).sequelize;
        // simple raw select with limit/offset
        const rows: any[] = await sequelize.query(
          `SELECT id, player_id as user_id, tournament_id, registration_date, punctuality FROM registrations ORDER BY registration_date DESC LIMIT ${perPage} OFFSET ${offset}`,
          { type: (sequelize as any).QueryTypes.SELECT }
        );
        const countRows: any[] = await sequelize.query(`SELECT COUNT(*) as c FROM registrations`, { type: (sequelize as any).QueryTypes.SELECT });
        const cnt = Number(countRows[0].c || 0);
        return { rows: rows.map(r => (Registration.build ? Registration.build(r) : r)), count: cnt, page, perPage };
      }
      throw err;
    }
  }

  /**
   * Obtiene una inscripción por su ID
   */
  async getById(id: number): Promise<Registration | null> {
    return Registration.findByPk(id);
  }

  /**
   * Crea una nueva inscripción
   */
  async create(data: Partial<Registration>): Promise<Registration> {
    try {
      return await Registration.create(data);
    } catch (err: any) {
      // If legacy schema uses player_id instead of user_id OR FK to players prevents insertion,
      // fallback to raw insert and attempt to create minimal players row when necessary.
      const errno = err && err.parent && err.parent.errno;
      if (errno === 1054 || errno === 1452) {
        const sequelize = (Registration as any).sequelize;
        const playerId = (data as any).user_id ?? (data as any).player_id;
        const tournamentId = (data as any).tournament_id;
        const registrationDate = (data as any).registration_date || new Date();
        const punctuality = (data as any).punctuality === undefined ? false : !!(data as any).punctuality;
        const sql = 'INSERT INTO registrations (player_id, tournament_id, registration_date, punctuality) VALUES (?, ?, ?, ?)';
        try {
          const res: any = await sequelize.query(sql, { replacements: [playerId, tournamentId, registrationDate, punctuality] });
          // get insertId (mysql returns insertId in result[0].insertId)
          const insertId = res && res[0] && (res[0].insertId || (res[0][0] && res[0][0].insertId)) ? (res[0].insertId || res[0][0].insertId) : null;
          return { id: insertId, user_id: playerId, tournament_id: tournamentId, registration_date: registrationDate, punctuality } as any;
        } catch (innerErr: any) {
          // If insertion failed because player_id references players table that has no row,
          // try to create a minimal players row and retry once.
          const pErr = innerErr && innerErr.parent && innerErr.parent.errno;
          if (pErr === 1452) {
            try {
              // attempt to create a players row mapping to the user
              // We'll insert minimal info: user_id and createdAt/updatedAt if those columns exist in schema
              // Use parameterized insert and ignore failures if columns don't exist
              // Try several common column combinations
              const username = (data as any).__username || null;
              // Prefer inserting (user_id) if that column exists
              try {
                await sequelize.query('INSERT INTO players (user_id, createdAt, updatedAt) VALUES (?, NOW(), NOW())', { replacements: [playerId] });
              } catch (e1) {
                // Fallback: insert with id explicit (may fail if id is auto-increment)
                try {
                  await sequelize.query('INSERT INTO players (id, createdAt, updatedAt) VALUES (?, NOW(), NOW())', { replacements: [playerId] });
                } catch (e2) {
                  // Last resort: try inserting username only
                  if (username) {
                    try { await sequelize.query('INSERT INTO players (username, createdAt, updatedAt) VALUES (?, NOW(), NOW())', { replacements: [username] }); } catch (_) {}
                  }
                }
              }

              // Retry registration insert after attempting to create players row
              const res2: any = await sequelize.query(sql, { replacements: [playerId, tournamentId, registrationDate, punctuality] });
              const insertId2 = res2 && res2[0] && (res2[0].insertId || (res2[0][0] && res2[0][0].insertId)) ? (res2[0].insertId || res2[0][0].insertId) : null;
              return { id: insertId2, user_id: playerId, tournament_id: tournamentId, registration_date: registrationDate, punctuality } as any;
            } catch (finalErr) {
              throw finalErr;
            }
          }
          throw innerErr;
        }
      }
      throw err;
    }
  }

  /**
   * Actualiza los datos de una inscripción por su ID
   */
  async updateById(id: number, data: Partial<Registration>): Promise<[number, Registration[]]> {
    return Registration.update(data, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Elimina una inscripción por su ID (eliminación real)
   */
  async deleteById(id: number): Promise<number> {
    return Registration.destroy({ where: { id } });
  }
}
