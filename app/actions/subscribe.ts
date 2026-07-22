'use server';

import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email(),
});

export type SubscribeState = {
  success: boolean;
};

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = SubscribeSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { success: false };
  }

  // PENDING: confirm with CTO — mailing-list provider integration
  void parsed.data.email;

  return { success: true };
}
