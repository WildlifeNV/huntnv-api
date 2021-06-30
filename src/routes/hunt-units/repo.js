import { rewriteNullAsObj } from '../../utils/pgpUtils.js'

const HuntUnitRepo = ({ db, pgp }) => {
  const getByName = async ({ name }) => {
    return await db.oneOrNone(
      'select * from hunt_unit_details where display_name = $<name>',
      { name },
      rewriteNullAsObj
    )
  }

  return {
    getByName
  }
}

export default HuntUnitRepo
