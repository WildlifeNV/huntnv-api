SELECT
  hunts.id,
  lkp_species_class.species,
  lkp_species_class.class,
  lkp_species_class.display_name,
  hunts.weapon,
  hunts.draw_type,
  hunts.season_dates,
  hunts.unit_group,
  hunt_units.hunt_units
FROM hunts
JOIN lkp_species_class ON hunts.species_id = lkp_species_class.id
JOIN (
  SELECT
    joiner.hunt_id,
    jsonb_agg(hunt_units.display_name) as hunt_units
  FROM joiner_hunt_units_hunts AS joiner
  JOIN hunt_units ON joiner.hunt_unit_id = hunt_units.id
  GROUP BY joiner.hunt_id
) AS hunt_units ON hunts.id = hunt_units.hunt_id
WHERE hunts.id = $<id>