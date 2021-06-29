SELECT
  hunts.id,
  hunts.species_id,
  lkp_species_class.display_name,
  lkp_species_class.species,
  lkp_species_class.class,
  hunts.weapon,
  hunts.draw_type,
  hunts.unit_group,
  hunts.season_dates,
  hunts.season_start_date,
  hunts.season_end_date,
  date_part('day', hunts.season_end_date::timestamp - hunts.season_start_date::timestamp) AS season_length_days,
  hunts.hunt_geometry_id,
  hunts.is_new,
  hunts.is_active,
  quotas.quota
FROM hunts
JOIN lkp_species_class ON hunts.species_id = lkp_species_class.id
JOIN quotas ON hunts.id = quotas.hunt_id
WHERE hunts.is_active = True