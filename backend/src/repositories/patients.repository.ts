import { randomUUID } from 'node:crypto'
import { db } from '../config/db.js'
import type { PatientInput } from '../schemas/patients.schema.js'

function mapPatient(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    email: row.email,
    address: {
      cep: row.cep,
      street: row.street,
      number: row.number,
      complement: row.complement,
      neighborhood: row.neighborhood,
      city: row.city,
      state: row.state,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const patientsRepository = {
  findAllPaginated(page: number, limit: number, search = '') {
    const offset = (page - 1) * limit
    const normalizedSearch = search.trim()
    const filters = normalizedSearch ? `WHERE LOWER(name) LIKE LOWER(?)` : ''
    const searchParam = `%${normalizedSearch}%`

    const items = db
      .prepare(
        `
        SELECT * FROM patients
        ${filters}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      )
      .all(...(normalizedSearch ? [searchParam, limit, offset] : [limit, offset]))

    const totalResult = db
      .prepare(`SELECT COUNT(*) as total FROM patients ${filters}`)
      .get(...(normalizedSearch ? [searchParam] : [])) as { total: number }

    return {
      items: items.map(mapPatient),
      total: totalResult.total,
      page,
      limit,
      totalPages: Math.ceil(totalResult.total / limit),
    }
  },

  findById(id: string) {
    const row = db.prepare(`SELECT * FROM patients WHERE id = ?`).get(id)
    return mapPatient(row)
  },

  findByEmail(email: string) {
    const row = db.prepare(`SELECT * FROM patients WHERE email = ?`).get(email)
    return mapPatient(row)
  },

  create(data: PatientInput) {
    const id = randomUUID()

    db.prepare(
      `
      INSERT INTO patients (
        id, name, birth_date, email, cep, street, number, complement,
        neighborhood, city, state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      data.name,
      data.birthDate,
      data.email,
      data.address.cep,
      data.address.street,
      data.address.number,
      data.address.complement ?? null,
      data.address.neighborhood,
      data.address.city,
      data.address.state,
    )

    return this.findById(id)
  },

  update(id: string, data: PatientInput) {
    db.prepare(
      `
      UPDATE patients
      SET
        name = ?,
        birth_date = ?,
        email = ?,
        cep = ?,
        street = ?,
        number = ?,
        complement = ?,
        neighborhood = ?,
        city = ?,
        state = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
      data.name,
      data.birthDate,
      data.email,
      data.address.cep,
      data.address.street,
      data.address.number,
      data.address.complement ?? null,
      data.address.neighborhood,
      data.address.city,
      data.address.state,
      id,
    )

    return this.findById(id)
  },

  delete(id: string) {
    return db.prepare(`DELETE FROM patients WHERE id = ?`).run(id)
  }
}
