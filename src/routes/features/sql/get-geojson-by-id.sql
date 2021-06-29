SELECT 
  json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(st_asgeojson(sq, 'geom_rhr', 5)::jsonb)
  )::jsonb AS geojson
FROM (
  SELECT *, st_forcerhr(geom) as geom_rhr
  FROM $<table:name> AS t
  WHERE t.id = $<id>
) AS sq