import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Ambil semua todos
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM "Todo" ORDER BY "createdAt" DESC'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch todos',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// POST - Buat todo baru
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO "Todo" ("title", "done", "createdAt") VALUES ($1, false, NOW()) RETURNING *',
      [title.trim()]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create todo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update todo (toggle done)
export async function PUT(req: NextRequest) {
  try {
    const { id, done } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'UPDATE "Todo" SET "done" = $1 WHERE "id" = $2 RETURNING *',
      [done, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update todo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Hapus todo
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'DELETE FROM "Todo" WHERE "id" = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete todo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
