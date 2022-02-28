WITH hunt_details AS (
  SELECT
    hunts.id AS hunt_id,
    hunts.is_new,
    hunts.is_active,
    lkp_species_class.display_name,
    lkp_species.species,
    hunts.weapon,
    hunts.draw_type,
    hunts.season_order_modifier,
    to_char(season_start_date, 'MM/DD/YYYY') || ' - ' || to_char(season_end_date, 'MM/DD/YYYY') AS season_dates,
    hunt_quotas.quota,
    harvest_data.harvest_rate,
    harvest_data.maturity_description,
    harvest_data.maturity_value,
    draw_data.median_bp_of_successful_applications,
    draw_data.draw_difficulty_qtile,
    draw_data.draw_difficulty_rank
  FROM hunts
  JOIN lkp_species_class ON hunts.species_class_id = lkp_species_class.id
  JOIN lkp_species ON lkp_species_class.species_id = lkp_species.id
  LEFT JOIN hunt_geometries ON hunts.hunt_geometry_id = hunt_geometries.id
  LEFT JOIN hunt_quotas ON hunts.id = hunt_quotas.hunt_id AND hunt_quotas.hunt_year = 2021
  LEFT JOIN hunt_seasons ON hunts.id = hunt_seasons.hunt_id AND hunt_seasons.hunt_year = 2021
  LEFT JOIN harvest_data ON hunts.id = harvest_data.hunt_id AND harvest_data.hunt_year = 2020
  LEFT JOIN draw_data ON hunts.id = draw_data.hunt_id AND draw_data.hunt_year = 2021
  WHERE hunts.is_active
    $<huntDetails:raw>
  ORDER BY hunt_seasons.season_start_date
),

hunts_json AS (
  SELECT
    hunts.hunt_geometry_id,
    hunts.species_class_id,
    jsonb_agg(hunt_details) AS hunts
  FROM hunts
  JOIN hunt_details ON hunts.id = hunt_details.hunt_id
  GROUP BY hunts.hunt_geometry_id, hunts.species_class_id
),

hunt_feed AS (
  SELECT
    hunt_geometries.id,
    hunt_geometries.hunt_units_arr,
    hunt_geometries.area * 0.000000386102 AS hunt_area_sq_miles,
    hunt_geometries_public_land.coverage * 100 AS percent_public_land,
    lkp_species.species,
    lkp_species_class.display_name,
    jsonb_array_length(hunts_json.hunts) AS total_hunts,
    hunts_json.hunts
  FROM hunts_json
  JOIN lkp_species_class ON hunts_json.species_class_id = lkp_species_class.id
  JOIN lkp_species ON lkp_species_class.species_id = lkp_species.id
  JOIN hunt_geometries ON hunts_json.hunt_geometry_id = hunt_geometries.id
  JOIN hunt_geometries_public_land ON hunt_geometries.id = hunt_geometries_public_land.hunt_geometry_id
)

SELECT
  sum(total_hunts) AS total_hunts,
  jsonb_agg(hunt_feed) AS hunt_feed
FROM hunt_feed
$<huntFeed:raw>