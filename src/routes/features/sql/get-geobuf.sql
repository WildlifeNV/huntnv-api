SELECT st_asgeobuf(sq, 'geom') AS geobuf
FROM (
  SELECT *
  FROM $<table:name>
  $<where:raw>
) AS sq