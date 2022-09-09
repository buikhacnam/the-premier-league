#!/usr/bin/env node

import fetch from 'node-fetch'
import { createSpinner } from 'nanospinner'
import dontenv from 'dotenv'
dontenv.config()

async function start() {
	const apiUrl = process.env.API_URL
	const spinner = createSpinner('English Premier League').start()
	const response = await fetch(apiUrl)
	const data = await response.json()
	const table = data?.items?.[0]?.table

	if (table && table?.rows?.length > 0) {
		spinner.success({ text: `` })
		const rows = table.rows.map(row => ({
			Position: row?.position,
			Club: row?.clubName,
			P: row?.played,
			PTS: row?.points,
			W: row?.won,
			D: row?.drawn,
			L: row?.lost,
			GF: row?.goalDifference,
			RF: row?.recentForm?.length > 0 ? row.recentForm.join(' ') : '--',
		}))

		// replace the first column 'index' with position
		const transformed = rows.reduce((acc, { Position, ...x }) => {
			acc[Position] = x
			return acc
		}, {})

		console.table(transformed)
	} else {
		spinner.fail({ text: `` })
		console.log('Oops, something went wrong')
	}

	process.exit(0)
}

console.clear()
await start()
