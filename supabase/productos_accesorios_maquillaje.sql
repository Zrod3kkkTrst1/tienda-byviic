-- Accesorios y Maquillaje BYVIIC — 2026
-- Ejecutar en Supabase → SQL Editor

DELETE FROM productos WHERE categoria = 'Maquillaje';
DELETE FROM productos WHERE categoria = 'Accesorios';

INSERT INTO productos (nombre, descripcion, precio, foto_url, fotos, categoria, por_encargo, stock, activo) VALUES

-- ── MAQUILLAJE ─────────────────────────────────────────────────────────────

('Lápiz Delineador Dolce Bella',
 'Lápiz delineador DOLCE bella.
Trazo preciso y larga duración.',
 1.75, '/M/M1.jpeg', '[]', 'Maquillaje', false, 10, true),

('Gloss Dolce Bella',
 'Gloss labial DOLCE bella.
Brillo y color en un solo producto.',
 3.00, '/M/M2.jpeg', '[]', 'Maquillaje', false, 10, true),

('Corrector Dolce Bella',
 'Corrector de maquillaje DOLCE bella.
Cobertura uniforme y duradera.
Tonos disponibles: Honey · Beige · Ivory · Caramel
Indica tu tono al hacer el pedido.',
 6.00, '/M/M3.jpeg', '[]', 'Maquillaje', false, 10, true),

('Lip Oil',
 'Lip oil hidratante.
Brillo natural y cuidado para tus labios.',
 2.00, '/M/M4.jpeg', '["/M/M44.jpeg"]', 'Maquillaje', false, 10, true),

('Cera de Cejas',
 'Cera de cejas de fijación duradera.
Define y peina tus cejas todo el día.',
 1.25, '/M/M5.jpeg', '[]', 'Maquillaje', false, 10, true),

('Primer ELF',
 'Primer de maquillaje ELF.
Base perfecta para mayor duración de tu maquillaje.',
 14.50, '/M/M6.jpeg', '[]', 'Maquillaje', false, 10, true),

-- ── ACCESORIOS ─────────────────────────────────────────────────────────────

('Pinza Dorada Fina',
 'Pinza dorada fina de precisión.
Ideal para la aplicación de pestañas.',
 3.00, '/A/A1.jpeg', '[]', 'Accesorios', false, 10, true),

('Pinza',
 'Pinza para aplicación de pestañas y accesorios.',
 1.50, '/A/A2.jpeg', '[]', 'Accesorios', false, 10, true),

('Mini Pinza',
 'Mini pinza de precisión.
Perfecta para detalles y aplicación de pestañas.',
 1.00, '/A/A3.jpeg', '[]', 'Accesorios', false, 10, true),

('Goma Salón Pro',
 'Goma para cabello salón profesional.
Alta durabilidad y sujeción.',
 2.50, '/A/A4.jpeg', '[]', 'Accesorios', false, 10, true),

('Lentes Sin Aumento',
 'Lentes decorativos sin aumento.
Accesorio ideal para complementar cualquier look.',
 2.50, '/accesorios/a1.jpg', '[]', 'Accesorios', false, 10, true);
