SELECT
  hunts.id,
  hunts.species_id,
  lkp_species_class.species,
  lkp_species_class.class,
  lkp_species_class.display_name,
  hunts.weapon,
  hunts.draw_type,
  hunts.unit_group,
  hunts.season_dates,
  hunts.is_new,
  hunts.is_active,
  quotas.quota,
  to_jsonb(hunt_units.hunt_units) AS units,
  (
    SELECT jsonb_agg(related_hunts)
    FROM (
      SELECT hunt_id, display_name, weapon, draw_type, season_dates, unit_group
      FROM (
        SELECT
          joiner.hunt_id,
          lkp_species_class.display_name,
          hunts.weapon,
          hunts.draw_type,
          hunts.season_dates,
          hunts.unit_group,
          jsonb_agg(hunt_units.display_name) as units
        FROM joiner_hunt_units_hunts AS joiner
        JOIN hunt_units ON joiner.hunt_unit_id = hunt_units.id
        JOIN hunts ON joiner.hunt_id = hunts.id
        JOIN lkp_species_class ON hunts.species_id = lkp_species_class.id
        GROUP BY 1, 2, 3, 4, 5, 6
        ORDER BY 4 DESC, 2, 3
      ) AS sq
      WHERE sq.units ?| hunt_units.hunt_units
    ) AS related_hunts
  ) AS similar_hunts
FROM hunts
JOIN lkp_species_class ON hunts.species_id = lkp_species_class.id
JOIN (
  SELECT
    joiner.hunt_id,
    array_agg(hunt_units.display_name) as hunt_units
  FROM joiner_hunt_units_hunts AS joiner
  JOIN hunt_units ON joiner.hunt_unit_id = hunt_units.id
  GROUP BY joiner.hunt_id
) AS hunt_units ON hunts.id = hunt_units.hunt_id
JOIN quotas ON hunts.id = quotas.hunt_id
WHERE hunts.id = $<id>