WITH all_hunts AS (
  SELECT
    hunts.id,
    hunts.hunt_geometry_id,
    hunts.species_class_id,
    lkp_species_class.display_name,
    lkp_species.species,
    hunts.weapon,
    hunts.draw_type,
    hunts.unit_group,
    hunts.season_order_modifier,
    hunt_seasons.hunt_year,
    hunt_seasons.season_dates,
    hunt_seasons.season_start_date,
    hunt_seasons.season_end_date,
    hunt_seasons.season_length,
    hunt_seasons.quota,
    hunt_data.applications,
    hunt_data.hunters_afield,
    hunt_data.draw_rate,
    hunt_data.success_rate,
    hunt_data.points_or_greater,
    hunt_data.length_or_greater
  FROM hunts
  JOIN lkp_species_class ON hunts.species_class_id = lkp_species_class.id
  JOIN lkp_species ON lkp_species_class.species_id = lkp_species.id
  LEFT JOIN hunt_seasons ON hunts.id = hunt_seasons.hunt_id
  LEFT JOIN hunt_data ON hunt_seasons.hunt_id = hunt_data.hunt_id
    AND hunt_seasons.hunt_year = hunt_data.hunt_year
)

SELECT *
FROM all_hunts
$<where:raw>