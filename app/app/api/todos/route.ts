import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil semua todos
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Todo')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase GET error:', error);
      throw error;
    }

    return NextResponse.json(data || []);
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

    const { data, error } = await supabase
      .from('Todo')
      .insert([
        { 
          title: title.trim(),
          done: false 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
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

    const { data, error } = await supabase
      .from('Todo')
      .update({ done })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PUT error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
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

    const { data, error } = await supabase
      .from('Todo')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase DELETE error:', error);
      throw error;
    }

    if (!data) {
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
