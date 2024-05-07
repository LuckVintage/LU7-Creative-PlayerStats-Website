async function getPlayerStats() {
    const playerName = document.getElementById("playername").value;

    // Check if playerName is empty
    if (playerName.trim() === "") {
        // Show SweetAlert error message
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a player name.",
        });
        return; // Stop further execution if playerName is empty
    }

    // Check if playerName contains slashes
    if (playerName.includes("/")) {
        // Show SweetAlert error message for invalid username
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a valid username.",
        });
        return; // Stop further execution if playerName contains slashes
    }
    const apiUrl = `https://mcapi.lu7.io/player/${playerName}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            displayStats(data);
            displayPlayerImage(data.uuid, data.name, data.lastOnlineTimestamp, data.firstJoinedTimestamp);

            // Update meta tags
            updateMetaTags(data.name, data.uuid);

            // Show share button if stats are displayed
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
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription.setAttribute("content", `View LU7 Creative player statistics for ${playerName}.`);

    // Update meta title
    document.title = `LU7 Creative - Player statistics for ${playerName}`;

    // Update meta image
    const metaImage = document.querySelector('meta[property="og:image"]');
    metaImage.setAttribute("content", `https://cravatar.eu/helmavatar/${playerUUID}/128.png`);
}

async function displayPlayerImage(playerUUID, playerName, lastOnlineTimestamp, firstJoinedTimestamp) {
    // Constructing URL for the player's image
    const playerImageURL = `https://cravatar.eu/helmavatar/${playerUUID}/128.png`;

    // Creating an image element
    const playerImageElement = document.createElement("img");
    playerImageElement.src = playerImageURL;
    playerImageElement.alt = "Player Image";

    // Adding the image element to the player image container
    const playerImageContainer = document.getElementById("player-image-container");
    playerImageContainer.innerHTML = "";
    playerImageContainer.style.display = "inline-block";
    playerImageContainer.appendChild(playerImageElement);

    // Adding the player's name to the player image box
    const playerNameElement = document.querySelector(".player-image-box h2");
    if (playerNameElement) {
        playerNameElement.innerHTML = `<i class="fas fa-user"></i> Player Information: ${playerName}`;
    } else {
        const playerImageBox = document.querySelector(".player-image-box");
        const playerNameElement = document.createElement("h2");
        playerNameElement.innerHTML = `<i class="fas fa-user"></i> Player Information: ${playerName}`; // Set new player name
        playerImageBox.appendChild(playerNameElement);
    }

    // Convert milliseconds to human-readable date formats
    const firstJoinedDate = new Date(firstJoinedTimestamp).toLocaleDateString();
    const firstJoinedTime = new Date(firstJoinedTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Adding last online timestamp if available
    let lastOnlineContent = '<span style="background-color: #7FFF7F; padding: 5px; border-radius: 7px;"><i class="fas fa-circle" style="color: green;"></i><span style="color: #000;"> Currently Online</span></span>';
    if (lastOnlineTimestamp) {
        const lastOnlineDate = new Date(lastOnlineTimestamp).toLocaleDateString();
        const lastOnlineTime = new Date(lastOnlineTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        lastOnlineContent = `<span style="background-color: #FF7F7F; padding: 5px; border-radius: 7px;"><i class="fas fa-clock"></i> Last Online: ${lastOnlineDate}, ${lastOnlineTime}</span>`;
    }

    // Adding first joined timestamp
    const playerTimestampsElement = document.createElement("div");
    playerTimestampsElement.className = "player-timestamps";
    playerTimestampsElement.innerHTML = `${lastOnlineContent}<p><i class="fas fa-clock"></i> First Joined: ${firstJoinedDate}, ${firstJoinedTime}</p>`;
    playerImageContainer.appendChild(playerTimestampsElement);

    // Adding styles for the player image box
    const playerImageBox = document.querySelector(".player-image-box");
    playerImageBox.style.border = "1px solid #ccc";
    playerImageBox.style.padding = "10px";
    playerImageBox.style.marginTop = "20px"; // Adjust margin as needed
    playerImageBox.style.textAlign = "center";
}

function displayStats(stats) {
    const statTranslations = {
        mysteryBoxes: '<i class="fas fa-box"></i> Mystery Boxes',
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
    statsContainer.innerHTML = ""; // Clear previous stats

    // Define playerName variable
    const playerName = document.getElementById("playername").value;

    // Loop through stats object
    for (const key in stats) {
        if (stats.hasOwnProperty(key) && key !== "lastOnlineTimestamp" && key !== "firstJoinedTimestamp") {
            const statValue = stats[key];
            const translatedKey = statTranslations[key] || key; // Use translated key if available, otherwise use original key

            const statElement = document.createElement("div");
            statElement.className = "stats-section";

            if (key === "plots") {
                if (statValue.length === 0) {
                    statElement.innerHTML = `<h2>${translatedKey}</h2><div class="stats-item"><i class="fas fa-times-circle"></i> ${playerName} hasn't claimed any plots yet.</div>`;
                } else {
                    statElement.innerHTML = `<h2>${translatedKey}</h2>`;
                    statValue.forEach((item) => {
                        const subStatElement = document.createElement("div");
                        subStatElement.className = "stats-item";
                        subStatElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.id}`;
                        statElement.appendChild(subStatElement);
                    });
                }
                statsContainer.appendChild(statElement);
            } else if (key !== "activePunishments") {
                if (typeof statValue === "object") {
                    statElement.innerHTML = `<h2>${translatedKey}</h2>`;
                    const subStats = Object.entries(statValue);
                    subStats.forEach(([subKey, subValue]) => {
                        const translatedSubKey = statTranslations[subKey] || subKey;
                        const subStatElement = document.createElement("div");
                        subStatElement.className = "stats-item";
                        subStatElement.innerHTML = `<strong>${translatedSubKey}:</strong> ${subValue}`;
                        statElement.appendChild(subStatElement);
                    });
                } else {
                    statElement.innerHTML = `<div class="stats-item"><strong>${translatedKey}:</strong> ${statValue}</div>`;
                }
                statsContainer.appendChild(statElement);
            }
        }
    }

    // Check if activePunishments is present in the API response
    const hasActivePunishments = "activePunishments" in stats;

    // Add activePunishments section if it's present, or create an empty array if it's absent
    const activePunishments = hasActivePunishments ? stats.activePunishments : [];

    // Create stats section for activePunishments
    const activePunishmentsElement = document.createElement("div");
    activePunishmentsElement.className = "stats-section";

    // Display activePunishments section header
    activePunishmentsElement.innerHTML = "<h2><i class='fas fa-hammer'></i> Active Punishments:</h2>";

    // Display activePunishments or a message if there are no active punishments
    if (activePunishments.length === 0) {
        activePunishmentsElement.innerHTML += `<div class="stats-item"><i class="fas fa-check-circle"></i> ${playerName} has no active punishments.</div>`;
    } else {
        // Loop through activePunishments and display each punishment
        activePunishments.forEach((punishment) => {
            const subStatElement = document.createElement("div");
            subStatElement.className = "stats-item";

            // Display each punishment's details
            Object.entries(punishment).forEach(([punishmentKey, punishmentValue]) => {
                const translatedPunishmentKey = statTranslations[punishmentKey] || punishmentKey;
                subStatElement.innerHTML += `<strong>${translatedPunishmentKey}:</strong> ${punishmentValue}<br>`;
            });

            activePunishmentsElement.appendChild(subStatElement);
        });
    }

    // Append activePunishments section to statsContainer, next to the plots section
    const plotsSection = document.querySelector(".stats-section h2:first-of-type");
    if (plotsSection) {
        statsContainer.insertBefore(activePunishmentsElement, plotsSection.parentNode.nextSibling);
    } else {
        // If plots section not found, append activePunishments section to the end
        statsContainer.appendChild(activePunishmentsElement);
    }
}

function displayError(message) {
    // Show SweetAlert error message
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}

function shareStats() {
    const playerName = document.getElementById("playername").value;
    const shareUrl = `${window.location.origin}${window.location.pathname}?playername=${playerName}`;

    // Copy URL to clipboard
    navigator.clipboard.writeText(shareUrl).then(
        function () {
            // Show SweetAlert success message
            Swal.fire({
                icon: "success",
                title: "URL Copied!",
                text: "Share this URL with others.",
                showConfirmButton: false,
                timer: 2500,
            });
        },
        function (err) {
            // Show SweetAlert error message if copying fails
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to copy URL to clipboard.",
            });
        }
    );
}

function resetStats() {
    // Clear player name input field
    document.getElementById("playername").value = "";

    // Clear stats container
    document.getElementById("stats-container").innerHTML = "";

    // Clear player image container
    document.getElementById("player-image-container").style.display = "none";

    // Hide share button
    document.getElementById("shareButton").style.display = "none";

    // Hide reset button
    document.getElementById("resetButton").style.display = "none";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription.setAttribute("content", `View LU7 Creative player statistics.`);

    // Update meta title
    document.title = `LU7 Creative - Player Stats Viewer`;

    // Update meta image
    const metaImage = document.querySelector('meta[property="og:image"]');
    metaImage.setAttribute("content", `https://cdn.luckvintage.com/LU7Logo2.png`);
}

// Automatically fetch stats if player name is present in the URL
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlayerName = urlParams.get("playername");
    if (urlPlayerName) {
        document.getElementById("playername").value = urlPlayerName; // Update input field
        getPlayerStats(); // Fetch stats
    }
};
