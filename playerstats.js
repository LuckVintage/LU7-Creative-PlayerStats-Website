async function getPlayerStats() {

    document.getElementById("loading-screen").style.display = "block";
    const playerName = document.getElementById("playername").value;

    if (playerName.trim() === "") {

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a player name.",
        });
        return; 

    }

    if (playerName.includes("/")) {

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a valid username.",
        });
        return; 

    }
    const apiUrl = `https://mcapi.lu7.io/player/${playerName}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        document.getElementById("loading-screen").style.display = "none";

        if (response.ok) {
            displayStats(data);
            displayPlayerImage(data.uuid, data.name, data.lastOnlineTimestamp, data.firstJoinedTimestamp, data.prefix);

            updateMetaTags(data.name, data.uuid);

            document.getElementById("shareButton").style.display = "inline-block";
            document.getElementById("resetButton").style.display = "inline-block";
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        displayError(error.message);
    }
}

function updateMetaTags(playerName, playerUUID) {

    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription.setAttribute("content", `View LU7 Creative player statistics for ${playerName}.`);

    document.title = `LU7 Creative - Player statistics for ${playerName}`;

    const metaImage = document.querySelector('meta[property="og:image"]');
    metaImage.setAttribute("content", `https://cravatar.eu/helmavatar/${playerUUID}/128.png`);
}

async function displayPlayerImage(playerUUID, playerName, lastOnlineTimestamp, firstJoinedTimestamp, prefix) {

    const playerImageURL = `https://cravatar.eu/helmavatar/${playerUUID}/128.png`;

    const playerImageElement = document.createElement("img");
    playerImageElement.src = playerImageURL;
    playerImageElement.alt = "Player Image";
    playerImageElement.className = "player-helm-avatar"; 

    const playerImageContainer = document.getElementById("player-image-container");
    playerImageContainer.innerHTML = "";
    playerImageContainer.style.display = "inline-block";
    playerImageContainer.appendChild(playerImageElement);

    const playerNameElement = document.querySelector(".player-image-box h2");
    if (playerNameElement) {
        playerNameElement.innerHTML = `<i class="fas fa-user"></i> [${prefix}]${playerName}`;
    } else {
        const playerImageBox = document.querySelector(".player-image-box");
        const playerNameElement = document.createElement("h2");
        playerNameElement.innerHTML = `<i class="fas fa-user"></i> [${prefix}] ${playerName}`; 

        playerImageBox.appendChild(playerNameElement);
    }

    const firstJoinedDate = new Date(firstJoinedTimestamp).toLocaleDateString();
    const firstJoinedTime = new Date(firstJoinedTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let lastOnlineContent = '<span class="online-status"><i class="fas fa-circle"></i> Currently Online</span>';
    if (lastOnlineTimestamp) {
        const lastOnlineDate = new Date(lastOnlineTimestamp).toLocaleDateString();
        const lastOnlineTime = new Date(lastOnlineTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        lastOnlineContent = `<span class="offline-status"><i class="fas fa-clock"></i> Last Online: ${lastOnlineDate}, ${lastOnlineTime}</span>`;
    }

    const playerTimestampsElement = document.createElement("div");
    playerTimestampsElement.className = "player-timestamps";
    playerTimestampsElement.innerHTML = `${lastOnlineContent}<p><i class="fas fa-clock"></i> First Joined: ${firstJoinedDate}, ${firstJoinedTime}</p>`;
    playerImageContainer.appendChild(playerTimestampsElement);

}

function formatTimestamp(timestamp) {
    if (timestamp === 0 || timestamp === '0' || timestamp === 'true' || timestamp === true) {
        return "Permanent / Never Expires";
    }

    const ms = Number(timestamp);
    if (isNaN(ms) || ms <= 0) {

        return String(timestamp);
    }

    const date = new Date(ms);

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

function formatDistance(cmValue) {
    if (typeof cmValue !== 'number' || isNaN(cmValue)) return cmValue;

    const meters = cmValue / 100;

    if (meters >= 1000) {
        const kilometers = meters / 1000;
        return `${kilometers.toLocaleString(undefined, { maximumFractionDigits: 2 })} KM`;
    } else {
        return `${meters.toLocaleString(undefined, { maximumFractionDigits: 2 })} M`;
    }
}

function formatTimeTicks(ticksValue) {
    if (typeof ticksValue !== 'number' || isNaN(ticksValue)) return ticksValue;

    const seconds = Math.floor(ticksValue / 20);
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let parts = [];
    if (days > 0) parts.push(days + 'd');
    if (hours > 0) parts.push(hours + 'h');

    if (minutes > 0 || parts.length === 0) parts.push(minutes + 'm');

    return parts.join(' ');
}

function displayStats(stats) {
    const statTranslations = {
        mysteryBoxes: '<i class="fas fa-box"></i> Mystery Boxes',
        prefix: '<i class="fas fa-crown"></i> Prefix',
        mysteryDust: '<i class="fas fa-seedling"></i> Mystery Dust',
        plotCount: '<i class="fas fa-map"></i> Plot Count',
        name: '<i class="fas fa-user"></i> Player Name',
        online: '<i class="fas fa-circle"></i> Online',
        uuid: '<i class="fas fa-fingerprint"></i> UUID',
        plots: '<i class="fas fa-map-marked-alt"></i> Owned Plots:',
        statistics: '<i class="fas fa-chart-bar"></i> Misc Statistics:',
        INTERACT_WITH_LOOM: '<i class="fas fa-hand-holding"></i> Interactions with Loom',
        CAULDRON_USED: '<i class="fas fa-burn"></i> Cauldrons Used',
        ANIMALS_BRED: '<i class="fas fa-hippo"></i> Animals Bred',
        INTERACT_WITH_BLAST_FURNACE: '<i class="fas fa-hammer"></i> Interactions with Blast Furnace',
        CRAFTING_TABLE_INTERACTION: '<i class="fas fa-tools"></i> Crafting Table Interactions',
        CAKE_SLICES_EATEN: '<i class="fas fa-birthday-cake"></i> Cake Slices Eaten',
        DEATHS: '<i class="fas fa-skull-crossbones"></i> Deaths',
        JUMP: '<i class="fas fa-angle-double-up"></i> Jumps',
        INTERACT_WITH_ANVIL: '<i class="fas fa-hammer"></i> Interactions with Anvil',
        BANNER_CLEANED: '<i class="fas fa-flag"></i> Banners Cleaned',
        WALK_ON_WATER_ONE_CM: '<i class="fas fa-tint"></i> Distance Walked on Water',
        INTERACT_WITH_STONECUTTER: '<i class="fas fa-cut"></i> Interactions with Stonecutter',
        BEACON_INTERACTION: '<i class="fas fa-lightbulb"></i> Beacon Interactions',
        SNEAK_TIME: '<i class="fas fa-shoe-prints"></i> Time Spent Sneaking',
        RAID_WIN: '<i class="fas fa-skull"></i> Raid Wins',
        ENDERCHEST_OPENED: '<i class="fas fa-cube"></i> Enderchests Opened',
        PLAY_ONE_MINUTE: '<i class="fas fa-clock"></i> Time Played',
        NOTEBLOCK_TUNED: '<i class="fas fa-music"></i> Noteblocks Tuned',
        SWIM_ONE_CM: '<i class="fas fa-swimmer"></i> Distance Swam',
        INTERACT_WITH_LECTERN: '<i class="fas fa-book-open"></i> Interactions with Lectern',
        ARMOR_CLEANED: '<i class="fas fa-shield-alt"></i> Armor Cleaned',
        FLOWER_POTTED: '<i class="fas fa-seedling"></i> Flowers Potted',
        DROPPER_INSPECTED: '<i class="fas fa-box-open"></i> Droppers Inspected',
        RAID_TRIGGER: '<i class="fas fa-bullhorn"></i> Raids Triggered',
        CROUCH_ONE_CM: '<i class="fas fa-walking"></i> Distance Crouched',
        DISPENSER_INSPECTED: '<i class="fas fa-boxes"></i> Dispensers Inspected',
        STRIDER_ONE_CM: '<i class="fas fa-fire"></i> Distance Stridden',
        DAMAGE_DEALT: '<i class="fas fa-skull-crossbones"></i> Damage Dealt',
        BELL_RING: '<i class="fas fa-bell"></i> Bells Rung',
        CLEAN_SHULKER_BOX: '<i class="fas fa-box"></i> Shulker Boxes Cleaned',
        TIME_SINCE_DEATH: '<i class="fas fa-hourglass-half"></i> Time Since Last Death',
        FLY_ONE_CM: '<i class="fas fa-plane"></i> Distance Flown',
        DAMAGE_ABSORBED: '<i class="fas fa-shield-alt"></i> Damage Absorbed',
        AVIATE_ONE_CM: '<i class="fas fa-plane"></i> Distance Aviated',
        INTERACT_WITH_GRINDSTONE: '<i class="fas fa-tools"></i> Interactions with Grindstone',
        TARGET_HIT: '<i class="fas fa-bullseye"></i> Targets Hit',
        FISH_CAUGHT: '<i class="fas fa-fish"></i> Fish Caught',
        TIME_SINCE_REST: '<i class="fas fa-bed"></i> Time Since Last Rest',
        DAMAGE_DEALT_RESISTED: '<i class="fas fa-shield-alt"></i> Damage Dealt Resisted',
        DAMAGE_TAKEN: '<i class="fas fa-skull-crossbones"></i> Damage Taken',
        LEAVE_GAME: '<i class="fas fa-sign-out-alt"></i> Times Left Game',
        FALL_ONE_CM: '<i class="fas fa-angle-double-down"></i> Distance Fallen',
        INTERACT_WITH_CARTOGRAPHY_TABLE: '<i class="fas fa-map"></i> Interactions with Cartography Table',
        TOTAL_WORLD_TIME: '<i class="fas fa-globe"></i> Total World Time',
        WALK_UNDER_WATER_ONE_CM: '<i class="fas fa-tint"></i> Distance Walked Underwater',
        MINECART_ONE_CM: '<i class="fas fa-train"></i> Distance Traveled by Minecart',
        CLIMB_ONE_CM: '<i class="fas fa-mountain"></i> Distance Climbed',
        SPRINT_ONE_CM: '<i class="fas fa-running"></i> Distance Sprinted',
        DROP_COUNT: '<i class="fas fa-trash-alt"></i> Items Dropped',
        INTERACT_WITH_SMITHING_TABLE: '<i class="fas fa-hammer"></i> Interactions with Smithing Table',
        CAULDRON_FILLED: '<i class="fas fa-burn"></i> Cauldrons Filled',
        RECORD_PLAYED: '<i class="fas fa-record-vinyl"></i> Records Played',
        MOB_KILLS: '<i class="fas fa-skull-crossbones"></i> Mob Kills',
        HOPPER_INSPECTED: '<i class="fas fa-boxes"></i> Hoppers Inspected',
        SLEEP_IN_BED: '<i class="fas fa-bed"></i> Times Slept in Bed',
        HORSE_ONE_CM: '<i class="fas fa-horse"></i> Distance Traveled by Horse',
        SHULKER_BOX_OPENED: '<i class="fas fa-box"></i> Shulker Boxes Opened',
        PIG_ONE_CM: '<i class="fas fa-road"></i> Distance Traveled by Pig',
        ITEM_ENCHANTED: '<i class="fas fa-magic"></i> Items Enchanted',
        OPEN_BARREL: '<i class="fas fa-archive"></i> Barrels Opened',
        WALK_ONE_CM: '<i class="fas fa-walking"></i> Distance Walked',
        NOTEBLOCK_PLAYED: '<i class="fas fa-music"></i> Noteblocks Played',
        TALKED_TO_VILLAGER: '<i class="fas fa-user-friends"></i> Times Talked to Villager',
        DAMAGE_DEALT_ABSORBED: '<i class="fas fa-shield-alt"></i> Damage Dealt Absorbed',
        TRADED_WITH_VILLAGER: '<i class="fas fa-handshake"></i> Times Traded with Villager',
        BREWINGSTAND_INTERACTION: '<i class="fas fa-beer"></i> Brewing Stand Interactions',
        BOAT_ONE_CM: '<i class="fas fa-ship"></i> Distance Traveled by Boat',
        DAMAGE_RESISTED: '<i class="fas fa-shield-alt"></i> Damage Resisted',
        INTERACT_WITH_SMOKER: '<i class="fas fa-smoking"></i> Interactions with Smoker',
        CHEST_OPENED: '<i class="fas fa-box-open"></i> Chests Opened',
        DAMAGE_BLOCKED_BY_SHIELD: '<i class="fas fa-shield-alt"></i> Damage Blocked by Shield',
        FURNACE_INTERACTION: '<i class="fas fa-fire"></i> Furnace Interactions',
        INTERACT_WITH_CAMPFIRE: '<i class="fas fa-campground"></i> Interactions with Campfire',
        TRAPPED_CHEST_TRIGGERED: '<i class="fas fa-truck-monster"></i> Trapped Chests Triggered',
        PLAYER_KILLS: '<i class="fas fa-skull-crossbones"></i> Player Kills',
        isPermanent: '<i class="fas fa-check-circle"></i> Is Permanent',
        executorUUID: '<i class="fas fa-user-secret"></i> Executor UUID',
        reason: '<i class="fas fa-ban"></i> Reason',
        executorName: '<i class="fas fa-user"></i> Executor Name',
        dateStart: '<i class="fas fa-calendar-alt"></i> Date Start',
        active: '<i class="fas fa-toggle-on"></i> Active',
        dateEnd: '<i class="fas fa-calendar-times"></i> Date End',
        id: '<i class="fas fa-id-badge"></i> ID',
        type: '<i class="fas fa-tags"></i> Type',
    };

    const statsContainer = document.getElementById("stats-container");
    statsContainer.innerHTML = ""; 

    const playerName = document.getElementById("playername").value;
    const playerUUID = stats.uuid || ''; 

    const generalStatsElement = document.createElement("div");
    generalStatsElement.className = "stats-section";
    generalStatsElement.innerHTML = "<h2><i class=\"fas fa-info-circle\"></i> General Information</h2>";

    generalStatsElement.innerHTML += `<p style="margin-top: -10px; font-size: 0.9em;">This section displays basic account details.</p>`;

    const generalStatKeys = ["name", "uuid", "prefix", "online", "plotCount", "mysteryDust", "mysteryBoxes"];

    generalStatKeys.forEach(key => {

        if (stats.hasOwnProperty(key) && typeof stats[key] !== 'object') {
            const statValue = stats[key];
            const translatedKey = statTranslations[key] || key;
            let formattedValue = statValue;

            if (typeof statValue === 'number' && key !== 'uuid') {

                formattedValue = statValue.toLocaleString();
            } else if (typeof statValue === 'boolean') {

                formattedValue = statValue ? 'Yes' : 'No';
            }

            const subStatElement = document.createElement("div");
            subStatElement.className = "stats-item";
            subStatElement.innerHTML = `<strong>${translatedKey}:</strong> ${formattedValue}`;
            generalStatsElement.appendChild(subStatElement);
        }
    });

    statsContainer.appendChild(generalStatsElement);

    const dynmapBaseUrl = "https://dynmap.lu7creative.net/";

    const plotsSection = document.createElement("div");
    plotsSection.className = "stats-section";
    const translatedPlotsKey = statTranslations["plots"] || "Plots";
    const plotStatValue = stats["plots"] || [];

    if (plotStatValue.length === 0) {
        plotsSection.innerHTML = `<h2>${translatedPlotsKey}</h2><div class="stats-item"><i class="fas fa-times-circle"></i> ${playerName} hasn't claimed any plots yet.</div>`;
    } else {
        plotsSection.innerHTML = `<h2>${translatedPlotsKey}</h2>`;

        plotsSection.innerHTML += `
            <p style="margin-top: -10px; font-size: 0.9em;">
                <a href="${dynmapBaseUrl}" target="_blank" style="font-weight: bold;"><i class="fas fa-external-link-alt"></i> View LU7 Creative Dynmap</a>
                <br>
                To find a plot, expand the markers section on Dynmap and search for the ID in the 'LU7 Creative Plots' section.
            </p>
        `;

        plotStatValue.forEach((item) => {
            const subStatElement = document.createElement("div");
            subStatElement.className = "stats-item";

            let plotID = item.id;

            plotID = plotID.replace(/;/g, ',');

            subStatElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${plotID}`;
            plotsSection.appendChild(subStatElement);
        });
    }
    statsContainer.appendChild(plotsSection);

    const bansBaseUrl = "https://bans.lu7creative.net/";

    const hasActivePunishments = "activePunishments" in stats;
    const activePunishments = hasActivePunishments ? stats.activePunishments : [];

    const activePunishmentsElement = document.createElement("div");
    activePunishmentsElement.className = "stats-section";
    activePunishmentsElement.innerHTML = "<h2><i class='fas fa-hammer'></i> Active Punishments:</h2>";

    activePunishmentsElement.innerHTML += `<p style="margin-top: -10px; font-size: 0.9em;">This section details any currently active bans, mutes and warnings applied to the player.</p>`;

    if (playerUUID) {
        const historyLink = `${bansBaseUrl}history.php?uuid=${playerUUID}`;
        activePunishmentsElement.innerHTML += `
            <p style="font-size: 0.9em;">
                <a href="${historyLink}" target="_blank" style="font-weight: bold;"><i class="fas fa-history"></i> View Full Punishment History</a>
                <br>
                Click any listed punishment ID below to view specific case details.
            </p>
        `;
    }

    if (activePunishments.length === 0) {
        activePunishmentsElement.innerHTML += `<div class="stats-item"><i class="fas fa-check-circle"></i> ${playerName} has no active punishments.</div>`;
    } else {

        activePunishments.forEach((punishment) => {
            const subStatElement = document.createElement("div");
            subStatElement.className = "stats-item";

            const punishmentID = punishment.id;

            const punishmentType = punishment.type.toLowerCase(); 
            const punishmentExecutor = punishment.executorName || 'N/A';

            const infoLink = `${bansBaseUrl}info.php?type=${punishmentType}&id=${punishmentID}`;

            subStatElement.innerHTML = `
                <p style="font-size: 1.1em; margin-bottom: 5px;">
                    <strong><a href="${infoLink}" target="_blank" title="View Punishment Details" style="text-decoration: none; color: #1e88e5;"><i class="fas fa-gavel"></i> Punishment ID: ${punishmentID} (${punishment.type})</a></strong>
                </p>
            `;

            Object.entries(punishment).forEach(([punishmentKey, punishmentValue]) => {
                const translatedPunishmentKey = statTranslations[punishmentKey] || punishmentKey;
                let formattedValue = punishmentValue;

                if (punishmentKey === 'id' || punishmentKey === 'type') {
                    return; 
                }

                if (punishmentKey === 'dateStart' || punishmentKey === 'dateEnd') {
                    formattedValue = formatTimestamp(punishmentValue);
                } else if (punishmentKey === 'isPermanent' || punishmentKey === 'active') {

                    formattedValue = punishmentValue === true ? 'Yes' : 'No';
                }

                subStatElement.innerHTML += `<strong>${translatedPunishmentKey}:</strong> ${formattedValue}<br>`;
            });

            activePunishmentsElement.appendChild(subStatElement);
        });
    }
    statsContainer.appendChild(activePunishmentsElement);

    const miscStats = stats["statistics"];

    const distanceKeys = [
        'WALK_ON_WATER_ONE_CM', 'SWIM_ONE_CM', 'CROUCH_ONE_CM', 'STRIDER_ONE_CM', 
        'FLY_ONE_CM', 'AVIATE_ONE_CM', 'FALL_ONE_CM', 'WALK_UNDER_WATER_ONE_CM', 
        'MINECART_ONE_CM', 'CLIMB_ONE_CM', 'SPRINT_ONE_CM', 'HORSE_ONE_CM', 
        'PIG_ONE_CM', 'BOAT_ONE_CM', 'WALK_ONE_CM'
    ];

    const timeKeys = [
        'PLAY_ONE_MINUTE', 'SNEAK_TIME', 'TIME_SINCE_DEATH', 'TOTAL_WORLD_TIME', 
        'TIME_SINCE_REST'
    ];

    if (miscStats && typeof miscStats === "object") {
        const miscStatsElement = document.createElement("div");

        miscStatsElement.className = "stats-section misc-stats-section"; 
        const translatedMiscKey = statTranslations["statistics"] || "Misc Statistics:";
        miscStatsElement.innerHTML = `<h2>${translatedMiscKey}</h2>`;

        const miscStatsGrid = document.createElement("div");

        miscStatsGrid.className = "misc-stats-grid"; 

        const subStats = Object.entries(miscStats);
        subStats.forEach(([subKey, subValue]) => {
            let formattedValue = subValue;

            if (distanceKeys.includes(subKey)) {
                formattedValue = formatDistance(subValue);
            } else if (timeKeys.includes(subKey)) {
                formattedValue = formatTimeTicks(subValue);
            } else if (typeof subValue === 'number') {

                formattedValue = subValue.toLocaleString();
            }

            const translatedSubKey = statTranslations[subKey] || subKey;
            const subStatElement = document.createElement("div");
            subStatElement.className = "stats-item";
            subStatElement.innerHTML = `<strong>${translatedSubKey}:</strong> ${formattedValue}`;
            miscStatsGrid.appendChild(subStatElement);
        });

        miscStatsElement.appendChild(miscStatsGrid);
        statsContainer.appendChild(miscStatsElement);
    }
}

function displayError(message) {

    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}

function shareStats() {
    const playerName = document.getElementById("playername").value;
    const shareUrl = `${window.location.origin}${window.location.pathname}?playername=${playerName}`;

    navigator.clipboard.writeText(shareUrl).then(
        function () {

            Swal.fire({
                icon: "success",
                title: "URL Copied!",
                text: "Share this URL with others.",
                showConfirmButton: false,
                timer: 2500,
            });
        },
        function (err) {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to copy URL to clipboard.",
            });
        }
    );
}

function resetStats() {

    document.getElementById("playername").value = "";

    document.getElementById("stats-container").innerHTML = "";

    document.getElementById("player-image-container").style.display = "none";

    document.getElementById("shareButton").style.display = "none";

    document.getElementById("resetButton").style.display = "none";

    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription.setAttribute("content", `View LU7 Creative player statistics.`);

    document.title = `LU7 Creative - Player Stats Viewer`;

    const metaImage = document.querySelector('meta[property="og:image"]');
    metaImage.setAttribute("content", `https://cdn.luckvintage.com/LU7Logo2.png`);
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlayerName = urlParams.get("playername");
    if (urlPlayerName) {
        document.getElementById("playername").value = urlPlayerName; 

        getPlayerStats(); 

    }
};