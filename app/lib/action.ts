'use server';

// import { Invoice } from '@/app/types'; // Adjust the import path
import { sql } from '@vercel/postgres'; // Adjust based on your database library
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const customer_id = formData.get('customerId') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const status = formData.get('status') as 'pending' | 'paid';

  // Validate the data
  if (!customer_id || !amount || isNaN(amount) || amount <= 0 || !status) {
    throw new Error('Invalid form data');
  }

  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  // Insert into the database
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customer_id}, ${amountInCents}, ${status}, ${date})
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const customer_id = formData.get('customerId') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const status = formData.get('status') as 'pending' | 'paid';

  // Validate the data
  if (!customer_id || !amount || isNaN(amount) || amount <= 0 || !status) {
    throw new Error('Invalid form data');
  }

  const amountInCents = Math.round(amount * 100);

  // Insert into the database
  await sql`
    UPDATE invoices
    SET customer_id = ${customer_id}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
