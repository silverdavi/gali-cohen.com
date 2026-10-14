import { site } from '../content';
import { formatWorkshopPrice } from '../cms/queries';
import { formatTimeRange } from './formatDate';
import type { Workshop } from '../cms/types';

// The Mindful Dance signup form opens WhatsApp with the workshop's own
// title, date, and place. A direct link uses those same lines, without the
// name and phone the form adds after someone fills it in.
export function workshopWhatsappHref(workshop: Workshop): string {
  const when = formatTimeRange(workshop.time, workshop.endTime);
  const lines = [
    `היי, אשמח להירשם לסדנה: ${workshop.title}`,
    `${workshop.dateLabel}${when ? ` · ${when}` : ''}${workshop.location ? ` · ${workshop.location}` : ''}`,
    formatWorkshopPrice(workshop),
  ];
  return `${site.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}
