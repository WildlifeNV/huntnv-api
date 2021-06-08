SELECT 
  json_build_object(
    'type', 'featureCollection',
    'features', json_agg(st_asgeojson(sq, 'geom', 5)::jsonb)
  )::jsonb AS geojson
FROM (
  SELECT *
  FROM $<table:name>
) AS sq