-- include landownership stuff
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
      SELECT hunt_id, display_name, species, class, weapon, draw_type, season_dates, unit_group
      FROM (
        SELECT
          joiner.hunt_id,
          lkp_species_class.display_name,
          lkp_species_class.species,
          lkp_species_class.class,
          hunts.weapon,
          hunts.draw_type,
          hunts.season_dates,
          hunts.unit_group,
          jsonb_agg(hunt_units.display_name) as units
        FROM joiner_hunt_units_hunts AS joiner
        JOIN hunt_units ON joiner.hunt_unit_id = hunt_units.id
        JOIN hunts ON joiner.hunt_id = hunts.id
        JOIN lkp_species_class ON hunts.species_id = lkp_species_class.id
        GROUP BY 1, 2, 3, 4, 5, 6, 7, 8
        ORDER BY 2, 5, 6 DESC
      ) AS sq
      WHERE sq.units ?| hunt_units.hunt_units
    ) AS related_hunts
  ) AS similar_hunts,
  (
    SELECT jsonb_agg(plc)
    FROM (
      SELECT
        joiner.hunt_id,
        plo.surface_mgmt_agency,
        sum(plc.area) AS area,
        sum(plc.area) / max(total.area) AS coverage,
        max(total.area) AS hunt_area
      FROM joiner_hunt_units_hunts AS joiner
      JOIN public_landownership_coverage AS plc ON joiner.hunt_unit_id = plc.hunt_unit_id
      JOIN public_landownership AS plo ON plc.public_landownership_id = plo.id
      JOIN (
        SELECT
          joiner.hunt_id,
          sum(hunt_units.area) AS area
        FROM joiner_hunt_units_hunts AS joiner
        JOIN hunt_units ON joiner.hunt_unit_id = hunt_units.id
        GROUP BY joiner.hunt_id
      ) AS total ON joiner.hunt_id = total.hunt_id
      WHERE joiner.hunt_id = hunts.id
      GROUP BY 1, 2
    ) AS plc
  ) AS landownership
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
