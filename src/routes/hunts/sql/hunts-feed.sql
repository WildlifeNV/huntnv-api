WITH hunt_stats AS (
  SELECT
    hunt_id,
    round(avg(applications)) AS avg_applications,
    round(avg(draw_rate), 4) AS draw_rate,
    round(avg(success_rate), 4) AS success_rate,
    round(avg(points_or_greater), 4) AS points_or_greater,
    round(avg(length_or_greater), 4) AS length_or_greater
  FROM hunt_data
  GROUP BY hunt_id
),

hunt_details AS (
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
    hunt_seasons.season_dates,
    hunt_seasons.season_start_date,
    hunt_seasons.season_end_date,
    hunt_seasons.season_length,
    hunt_seasons.quota,
    hunt_stats.avg_applications,
    hunt_stats.draw_rate,
    hunt_stats.success_rate,
    hunt_stats.points_or_greater,
    hunt_stats.length_or_greater
  FROM hunts
  JOIN lkp_species_class ON hunts.species_class_id = lkp_species_class.id
  JOIN lkp_species ON lkp_species_class.species_id = lkp_species.id
  JOIN hunt_seasons ON hunts.id = hunt_seasons.hunt_id AND hunt_seasons.hunt_year = 2021
  LEFT JOIN hunt_stats ON hunts.id = hunt_stats.hunt_id
  $<where:raw>
),

hunt_feed AS (
  SELECT
    hunts.hunt_geometry_id,
    hunts.species_class_id,
    (
      SELECT jsonb_agg(hd)
      FROM (
        SELECT *
        FROM hunt_details
        WHERE hunt_details.hunt_geometry_id = hunts.hunt_geometry_id
          AND hunt_details.species_class_id = hunts.species_class_id
        ORDER BY draw_type, season_start_date
      ) AS hd
    ) AS hunts
  FROM hunts
  JOIN hunt_details ON hunts.id = hunt_details.id
  GROUP BY hunts.hunt_geometry_id, hunts.species_class_id
)

SELECT
  hunt_geometries.id AS hunt_geometry_id,
  hunt_geometries.hunt_units_arr,
  hunt_geometries.area,
  hunt_geometries_public_land.coverage AS public_land_pct,
  lkp_species_class.display_name,
  jsonb_array_length(hunt_feed.hunts) AS total_hunts,
  hunt_feed.hunts
FROM hunt_feed
JOIN lkp_species_class ON hunt_feed.species_class_id = lkp_species_class.id
JOIN hunt_geometries ON hunt_feed.hunt_geometry_id = hunt_geometries.id
JOIN hunt_geometries_public_land ON hunt_geometries.id = hunt_geometries_public_land.hunt_geometry_id;