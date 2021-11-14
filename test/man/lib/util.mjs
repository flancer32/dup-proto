/**
 * Library with functions to help with manual tests.
 */

const DEF = {
    cfgPrefix: '', // test web push plugin
};

/**
 * Load DEM from the root of the current plugin. Scan for teq-plugins in 'node_modules'.
 *
 * This function has classic input interface (low variability is expected) and compositional output.
 *
 * @param {TeqFw_Di_Shared_Container} container
 * @param {string} path to folder with './node_modules' inside.
 * @return {Promise<{cfg: TeqFw_Db_Back_Dto_Config_Schema, dem: TeqFw_Db_Back_Dto_Dem}>}
 */
export async function loadRoot(container, path) {
    /** @type {TeqFw_Core_Back_Scan_Plugin} */
    const pluginScan = await container.get('TeqFw_Core_Back_Scan_Plugin$');
    /** @type {TeqFw_Db_Back_Dem_Load} */
    const demLoad = await container.get('TeqFw_Db_Back_Dem_Load$');

    // prepare this unit runtime objects
    await pluginScan.exec(path); // scan for teq-plugins' names
    const {dem, cfg} = await demLoad.exec({path}); // scan for DEMs (map is omitted in results)
    cfg.prefix = DEF.cfgPrefix;
    return {dem, cfg};
}
