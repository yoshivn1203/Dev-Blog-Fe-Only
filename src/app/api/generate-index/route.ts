import { exec } from 'child_process'
import { NextResponse } from 'next/server'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    await execAsync('node scripts/generateBlogIndex.js')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error generating index:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate index' }, { status: 500 })
  }
}
