SELECT 
  json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(st_asgeojson(sq, 'geom_rhr', 5)::jsonb)
  )::jsonb AS geojson
FROM (
  SELECT
    *,
    st_forcepolygoncw(geom) AS geom_rhr
  FROM $<table:name>
  $<where:raw>
) AS sq