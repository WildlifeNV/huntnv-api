WITH hunt_year AS (
  SELECT
    CASE
      WHEN date_part('month', CURRENT_DATE)::int >= 3 THEN date_part('year', CURRENT_DATE)::int
      ELSE date_part('year', CURRENT_DATE)::int - 1
    END AS year
),

related_hunts AS (
  SELECT
    joiner.hunt_id,
    lkp_species_class.display_name,
    lkp_species.species,
    hunts.weapon,
    hunts.draw_type,
    hunt_seasons.season_dates,
    hunts.unit_group,
    min(hunt_seasons.quota) AS quota,
    jsonb_agg(hunt_units.display_name) as units
  FROM joiner_hunt_units_hunts AS joiner
  JOIN hunt_units ON joiner.hunt_unit_id = hunt_units.id
  JOIN hunts ON joiner.hunt_id = hunts.id
  JOIN lkp_species_class ON hunts.species_class_id = lkp_species_class.id
  JOIN lkp_species ON lkp_species_class.species_id = lkp_species.id
  JOIN hunt_seasons ON hunts.id = hunt_seasons.hunt_id
    AND hunt_seasons.hunt_year = (SELECT year FROM hunt_year)
  GROUP BY 1, 2, 3, 4, 5, 6, 7
),

landownership AS (
  SELECT
    hunt_geometry_id,
    jsonb_agg(
      jsonb_build_object(
        'surface_mgmt_agency', surface_mgmt_agency,
        'area', area,
        'coverage', coverage
      )
    ) AS landownership_arr
  FROM hunt_geometries_landownership
  JOIN public_landownership ON hunt_geometries_landownership.public_landownership_id = public_landownership.id
  WHERE coverage >= 0.01
  GROUP BY hunt_geometry_id
),

hunt_stats AS (
  SELECT
    hunts.id AS hunt_id,
    hunts.hunt_narrative_id,
    hunt_data.hunt_year,
    hunts.draw_type,
    lkp_species_class.display_name,
    hunts.unit_group,
    hunts.weapon,
    hunts.season_order_modifier,
    hunt_seasons.season_dates,
    hunt_seasons.quota,
    hunt_data.applications,
    hunt_data.hunters_afield,
    hunt_data.successful_hunters,
    hunt_data.draw_rate,
    hunt_data.success_rate,
    hunt_data.points_or_greater,
    hunt_data.length_or_greater,
    hunt_data.hunt_days,
    hunt_data.effort_days,
    hunt_data.hunter_satisfaction
  FROM hunts
  JOIN lkp_species_class ON hunts.species_class_id = lkp_species_class.id
  JOIN hunt_seasons ON hunts.id = hunt_seasons.hunt_id
  LEFT JOIN hunt_data ON hunt_seasons.hunt_id = hunt_data.hunt_id
    AND hunt_seasons.hunt_year = hunt_data.hunt_year
),

hunt_stats_gb_narrative AS (
  SELECT
    hunt_narrative_id,
    jsonb_agg(
      to_jsonb(hunt_stats.*) - 'hunt_narrative_id'
    ) AS stats
  FROM hunt_stats
  GROUP BY hunt_narrative_id
)

SELECT
  hunts.id,
  hunts.hunt_geometry_id,
  hunts.hunt_narrative_id,
  lkp_species_class.display_name,
  hunts.weapon,
  hunts.draw_type,
  hunts.unit_group,
  hunt_geometries.hunt_units_arr,
  hunts.season_order_modifier,
  hunt_geometries.area,
  hunt_geometries_public_land.coverage AS public_land_pct,
  hunt_seasons.season_dates,
  hunt_seasons.season_start_date,
  hunt_seasons.season_end_date,
  hunt_seasons.season_length,
  hunt_seasons.quota,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'hunt_id', related_hunts.hunt_id,
        'display_name', related_hunts.display_name,
        'species', related_hunts.species,
        'weapon', related_hunts.weapon,
        'draw_type', related_hunts.draw_type,
        'season_dates', related_hunts.season_dates,
        'unit_group', related_hunts.unit_group,
        'quota', related_hunts.quota
    ))
    FROM related_hunts
    WHERE related_hunts.units @> hunt_geometries.hunt_units_arr
  ) AS related_hunts,
  landownership.landownership_arr AS landownership,
  hunt_stats_gb_narrative.stats AS hunt_stats
FROM hunts
JOIN lkp_species_class ON hunts.species_class_id = lkp_species_class.id
JOIN lkp_species ON lkp_species_class.species_id = lkp_species.id
LEFT JOIN hunt_seasons ON hunts.id = hunt_seasons.hunt_id
  AND hunt_seasons.hunt_year = (SELECT year FROM hunt_year)
JOIN hunt_geometries ON hunts.hunt_geometry_id = hunt_geometries.id
JOIN hunt_geometries_public_land ON hunts.hunt_geometry_id = hunt_geometries_public_land.hunt_geometry_id
JOIN landownership ON hunts.hunt_geometry_id = landownership.hunt_geometry_id
LEFT JOIN hunt_stats_gb_narrative ON hunts.hunt_narrative_id = hunt_stats_gb_narrative.hunt_narrative_id
WHERE hunts.id = 485;