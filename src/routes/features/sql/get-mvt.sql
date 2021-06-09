WITH
bounds AS (
  SELECT st_tileenvelope($<z>, $<x>, $<y>) AS geom
),


mvtgeom AS (
  SELECT
    st_asmvtgeom(st_transform(t.geom, 3857), bounds.geom) as geom,
    *
  FROM $<table:name> AS t, bounds
  WHERE st_intersects(t.geom, st_transform(bounds.geom, 4326)) 
)

SELECT st_asmvt(mvtgeom.*, $<table>, 4096, 'geom', 'id') AS mvt
FROM mvtgeom;
