import type { MetadataRoute } from 'next';
import { restaurante } from '@/config/restaurante';

export default function robots(): MetadataRoute.Robots {
  return restaurante.demo
    ? { rules: { userAgent: '*', disallow: '/' } }
    : { rules: { userAgent: '*', allow: '/' } };
}
