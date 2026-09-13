# Taller SQL · Reservas de hotel en la nube

**Objetivos:**
- Ejecutar consultas SQL sobre datos reales de reservas (SELECT, WHERE, GROUP BY, ORDER BY, filtros).
- Explorar un dataset de reservas hoteleras y responder preguntas de negocio con SQL.
- Usar un entorno en la nube (Colab) sin instalar nada.

**Dataset:** Reservas de hotel (ej. [Hotel Booking Cancellation Prediction en Kaggle](https://www.kaggle.com/code/farzadnekouei/hotel-booking-cancellation-prediction/notebook)).

**Duración orientativa:** ~30 min explicación + 15–30 min práctica + resolución de ejercicios.

## 1. Dataset y carga en SQLite

A continuación cargamos los datos en una base **SQLite** en memoria. Así podemos escribir SQL y ver los resultados en la misma página.

**Opciones:**
- **En Colab:** usar el CSV de ejemplo embebido (ya incluido).
- **En Kaggle:** descomentar la celda que lee desde `/kaggle/input/...` y usar `hotel_booking.csv`.

```python

import pandas as pd
import sqlite3

# --- OPCIÓN A: CSV de ejemplo (funciona en Colab sin Kaggle) ---
CSV_EJEMPLO = '''hotel,is_canceled,lead_time,arrival_date_year,arrival_date_month,arrival_date_day_of_month,stays_in_weekend_nights,stays_in_week_nights,adults,children,babies,meal,country,customer_type,adr,reservation_status,reservation_status_date
Resort Hotel,0,342,2015,July,1,0,0,2,0,0,BB,PRT,Transient,0.0,Check-Out,2015-07-01
Resort Hotel,0,737,2015,July,1,0,0,2,0,0,BB,GBR,Transient,0.0,Check-Out,2015-07-01
Resort Hotel,0,7,2015,July,1,0,1,1,0,0,BB,GBR,Transient,75.0,Check-Out,2015-07-02
Resort Hotel,0,13,2015,July,2,0,1,1,0,0,BB,GBR,Transient,75.0,Check-Out,2015-07-02
Resort Hotel,0,14,2015,July,3,0,2,2,0,0,BB,GBR,Transient,98.0,Check-Out,2015-07-03
City Hotel,1,2,2015,July,1,0,2,2,0,0,BB,PRT,Transient,100.0,Canceled,2015-06-29
City Hotel,0,50,2015,July,5,1,3,2,1,0,HB,ESP,Transient,120.0,Check-Out,2015-07-08
Resort Hotel,0,100,2015,August,10,1,2,2,0,0,BB,FRA,Transient,85.0,Check-Out,2015-08-12
City Hotel,1,30,2015,August,15,0,1,1,0,0,BB,DEU,Transient,60.0,Canceled,2015-08-01
Resort Hotel,0,0,2016,January,2,1,0,2,0,0,BB,PRT,Transient,90.0,Check-Out,2016-01-02
City Hotel,0,45,2016,March,14,0,2,2,0,0,SC,ITA,Transient,110.0,Check-Out,2016-03-16
Resort Hotel,1,120,2016,July,20,2,3,4,2,0,HB,GBR,Group,200.0,Canceled,2016-06-15
City Hotel,0,3,2016,December,31,1,1,2,0,0,BB,PRT,Transient,95.0,Check-Out,2017-01-01
Resort Hotel,0,21,2017,August,5,0,4,2,0,0,BB,ESP,Transient,88.0,Check-Out,2017-08-09
City Hotel,0,7,2017,August,12,1,2,2,0,0,BB,FRA,Transient,102.0,Check-Out,2017-08-14
Resort Hotel,0,14,2015,July,8,0,1,1,0,0,BB,PRT,Transient,70.0,Check-Out,2015-07-09
City Hotel,0,35,2016,February,20,0,2,2,0,0,BB,GBR,Transient,115.0,Check-Out,2016-02-22
Resort Hotel,1,90,2016,May,10,0,2,2,0,0,HB,DEU,Transient,130.0,Canceled,2016-04-15
City Hotel,0,1,2017,January,1,0,2,2,0,0,BB,PRT,Transient,99.0,Check-Out,2017-01-03
Resort Hotel,0,60,2015,September,3,1,1,2,0,0,BB,ITA,Transient,92.0,Check-Out,2015-09-04
City Hotel,0,28,2016,November,11,0,3,2,1,0,BB,ESP,Transient,105.0,Check-Out,2016-11-14
'''

from io import StringIO
df = pd.read_csv(StringIO(CSV_EJEMPLO))

# --- OPCIÓN B (Kaggle): descomentar y comentar la opción A ---
# df = pd.read_csv('/kaggle/input/hotel-bookingcvs/hotel_booking.csv')

print('Filas:', len(df))
df.head(10)

```

```python

# Crear base SQLite en memoria y volcar el DataFrame
conn = sqlite3.connect(':memory:')
df.to_sql('bookings', conn, index=False, if_exists='replace')

def query(sql):
    """Ejecuta una consulta SQL y muestra el resultado en tabla."""
    return pd.read_sql_query(sql, conn)

print('Tabla "bookings" creada. Usa query("SELECT ...") en la siguiente celda.')

```

**Opcional (informativo):** Puedes volcar la base SQLite a un archivo en Colab y ver cuánto pesa. Así tienes una idea del tamaño de la base con la que trabajas.

```python

# Volcar la base en memoria a un archivo y ver su tamaño (solo informativo)
import os
archivo_db = 'bookings.db'
conn_disco = sqlite3.connect(archivo_db)
conn.backup(conn_disco)
conn_disco.close()
tam = os.path.getsize(archivo_db)
print(f'Base exportada: {archivo_db} → {tam:,} bytes ({tam/1024:.2f} KB)')

```

## 2. Práctica: consultas básicas

Escribe en la celda de abajo algo como: `query('SELECT ...')` y ejecuta para ver el resultado.

```python

# Ejemplo: listar todas las columnas de las primeras filas
query('SELECT * FROM bookings LIMIT 5')

```

### SELECT y columnas concretas

```python

query('''
  SELECT hotel, arrival_date_year, arrival_date_month, adr, reservation_status
  FROM bookings
  LIMIT 8
''')

```

### WHERE y AND

```python

query('''
  SELECT hotel, arrival_date_month, adr, reservation_status
  FROM bookings
  WHERE hotel = 'City Hotel' AND is_canceled = 0
''')

```

### IN (varios valores)

```python

query('''
  SELECT hotel, country, adr
  FROM bookings
  WHERE country IN ('ESP', 'PRT', 'ITA')
  LIMIT 10
''')

```

### GROUP BY y COUNT

```python

query('''
  SELECT hotel, COUNT(*) AS num_reservas
  FROM bookings
  GROUP BY hotel
''')

```

### ORDER BY (ordenar resultados)

```python

query('''
  SELECT country, COUNT(*) AS num_reservas
  FROM bookings
  GROUP BY country
  ORDER BY num_reservas DESC
  LIMIT 8
''')

```

### Filtro simple por fecha

En SQLite las fechas en texto se pueden comparar si tienen formato `YYYY-MM-DD`.

```python

query('''
  SELECT reservation_status_date, hotel, adr, reservation_status
  FROM bookings
  WHERE reservation_status_date >= '2016-01-01'
  ORDER BY reservation_status_date
  LIMIT 10
''')

```

---
## 3. Ejercicios (≈30 min)

Una celda por ejercicio: escribe tu consulta en `query('...')` y ejecuta. Después se corregirán en clase.

### Ejercicio 1
**Listar** hotel, mes de llegada y ADR de las reservas **no canceladas** (is_canceled = 0).

```python

query('')  # Escribe aquí tu SELECT ...

```

### Ejercicio 2
**Contar** cuántas reservas hay por `reservation_status` (Check-Out, Canceled, etc.).

```python

query('')

```

### Ejercicio 3
**Obtener** el número de reservas por `arrival_date_year` y ordenar por año.

```python

query('')

```

### Ejercicio 4
**Calcular** la suma total de `adr` por hotel (ingresos por tipo de hotel usando ADR como proxy).

```python

query('')

```

### Ejercicio 5
**Listar** reservas con `adr` mayor que 100 y que sean del **City Hotel**.

```python

query('')

```

### Ejercicio 6
**Contar** reservas por `customer_type` y ordenar de mayor a menor cantidad.

```python

query('')

```

### Ejercicio 7
**Mostrar** reservas cuya fecha de estado (`reservation_status_date`) sea de **2016**.

```python

query('')

```

### Ejercicio 8
**Obtener** el número de reservas por mes de llegada (`arrival_date_month`) solo para **Resort Hotel**.

```python

query('')

```

### Ejercicio 9
**Listar** países (`country`) con más de 1 reserva, ordenados por número de reservas descendente.

```python

query('')

```

### Ejercicio 10
**Combinar:** reservas de julio o agosto (`arrival_date_month` IN ('July','August')), no canceladas, mostrando hotel, mes, adr y ordenando por adr descendente.

```python

query('')

```

---
**Referencias:**
- [Notebook de referencia en Kaggle](https://www.kaggle.com/code/farzadnekouei/hotel-booking-cancellation-prediction/notebook)
- Dataset: Hotel Booking (predicción de cancelaciones).
