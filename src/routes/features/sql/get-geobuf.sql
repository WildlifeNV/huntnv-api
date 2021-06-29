SELECT st_asgeobuf(sq, 'geom') AS geobuf
FROM (
  SELECT
    id,
    st_forcepolygoncw(geom) AS geom
  FROM $<table:name>
  $<where:raw>
) AS sq