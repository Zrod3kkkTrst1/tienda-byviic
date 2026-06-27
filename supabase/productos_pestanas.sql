-- Pestañas BYVIIC — nuevas fotos 2026
-- Ejecutar en Supabase → SQL Editor

DELETE FROM productos WHERE categoria = 'Pestañas';

INSERT INTO productos (nombre, descripcion, precio, foto_url, fotos, categoria, por_encargo, stock, activo) VALUES

('Mini',
 'Pestañas Mini · Curva D
Disponible en: 10P
Medidas: 8-16mm
Indica la cantidad al hacer tu pedido.',
 3.25, '/P/P1.jpeg', '["/P/P11.jpeg", "/P/P111.mp4"]', 'Pestañas', false, 10, true),

('Set Natural',
 'Set completo · Curva D
Incluye goma, sellador y pinza
Disponible en: 10P
Ideal para principiantes.',
 7.00, '/P/P2.jpeg', '["/P/P22.mp4"]', 'Pestañas', false, 10, true),

('Miniu',
 'Pestañas Miniu · Curva D
Disponible en: 40P
Medidas: 9-16mm
Indica la cantidad al hacer tu pedido.',
 6.00, '/P/P3.jpeg', '["/P/P33.jpeg", "/P/P333.mp4"]', 'Pestañas', false, 10, true),

('Mini Tupida',
 'Pestañas Mini Tupida · Curva D
Disponible en: 60P · 80P · 100P
Indica la cantidad al hacer tu pedido.',
 6.00, '/P/P4.jpeg', '["/P/P44.jpeg", "/P/P444.mp4"]', 'Pestañas', false, 10, true),

('Libro Flow',
 'Pestañas Libro Flow · Curva D
Disponible en: 30P · 50P · 80P · 100P
Indica la cantidad al hacer tu pedido.',
 9.00, '/P/P5.jpeg', '["/P/P55.jpeg", "/P/P555.mp4"]', 'Pestañas', false, 10, true),

('Libro Clusters',
 'Pestañas Libro Clusters · Curva D
Disponible en: 10P · 20P · 30P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/P6.jpeg', '["/P/P66.jpeg", "/P/P666.mp4"]', 'Pestañas', false, 10, true),

('Libro Book',
 'Pestañas Libro Book · Curva D
Disponible en: 30P · 40P · 50P · 60P · 80P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/P7.jpeg', '["/P/P77.jpeg", "/P/P777.mp4"]', 'Pestañas', false, 10, true),

('Libro Book',
 'Pestañas Libro Book · Curva D
Disponible en: 30P · 40P · 50P · 60P · 80P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/P8.jpeg', '["/P/P88.mp4"]', 'Pestañas', false, 10, true),

('Libro Fluffy',
 'Pestañas Libro Fluffy · Curva D
Disponible en: 30P · 40P
Indica la cantidad al hacer tu pedido.',
 10.00, '/P/P9.jpeg', '["/P/P99.jpeg", "/P/P999.jpeg", "/P/P9999.mp4"]', 'Pestañas', false, 10, true),

('Libro Byvic',
 'Pestañas Libro Byvic · Curva D
Disponible en: 30P · 40P · 60P · 80P
Indica la cantidad al hacer tu pedido.',
 9.00, '/P/P10.jpeg', '["/P/P100.jpeg", "/P/P1000.mp4"]', 'Pestañas', false, 10, true),

('Libro DIY',
 'Pestañas Libro DIY · Curva D
Disponible en: 30P · 40P · 50P · 60P · 80P · 100P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/PP1.jpeg', '["/P/PP11.jpeg", "/P/PP111.mp4"]', 'Pestañas', false, 10, true),

('Libro Muñeca',
 'Pestañas Libro Muñeca · Curva D
Indica la cantidad al hacer tu pedido.',
 9.00, '/P/PP2.jpeg', '["/P/PP22.jpeg", "/P/PP222.mp4"]', 'Pestañas', false, 10, true),

('Libro Tupida',
 'Pestañas Libro Tupida · Curva D
Disponible en: 30P · 40P · 60P · 80P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/PP3.jpeg', '["/P/PP33.jpeg", "/P/PP333.mp4"]', 'Pestañas', false, 10, true),

('Libro Rous',
 'Pestañas Libro Rous · Curva D
Disponible en: 10P · 20P · 30P · 40P · 50P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/PP4.jpeg', '["/P/PP44.jpeg", "/P/PP444.mp4"]', 'Pestañas', false, 10, true),

('Libro Individual',
 'Pestañas Libro Individual · Curva D
Disponible en: 30P · 40P · 50P
Indica la cantidad al hacer tu pedido.',
 8.50, '/P/PP5.jpeg', '["/P/PP55.jpeg", "/P/PP555.mp4"]', 'Pestañas', false, 10, true);
