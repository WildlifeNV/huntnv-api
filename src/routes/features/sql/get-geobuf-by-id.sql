SELECT st_asgeobuf(sq, 'geom') AS geobuf
FROM (
  SELECT *
  FROM $<table:name> AS t
  WHERE t.id = $<id>
) AS sq