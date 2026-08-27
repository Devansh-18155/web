/**
 * Supabase Feedback Service
 * Handles feedback submissions from /feedback
 */

import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './client';

export interface SubmitFeedbackData {
  user_id: string;
  subject: string;
  message: string;
}

/**
 * Submit a piece of feedback.
 *
 * The `feedback` table is insert only. There is no select policy, so there is
 * deliberately no function here to read submissions back. Read them in the
 * Supabase dashboard.
 */
export async function submitFeedback(
  data: SubmitFeedbackData,
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase.from('feedback').insert({
    user_id: data.user_id,
    subject: data.subject.trim(),
    message: data.message.trim(),
  });

  if (error) {
    console.error('Error submitting feedback:', error);
    return { error };
  }

  return { error: null };
}
