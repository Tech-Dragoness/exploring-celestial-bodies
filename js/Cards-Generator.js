function generateCards(cardType) {
    const cardSets = [];
    let currentSet = [];
    let rows;

    if (cardType=="stars") {
    // Filter for the correct row type (e.g., "stars")
    rows = cachedRows.filter(row => {
      return row["Type"] && row["Type"].toLowerCase().trim() === 'stars'; // Filter based on the type
    });
    }

    else if (cardType=="planets") {
      // Filter for the correct row type (e.g., "stars")
      rows = cachedRows.filter(row => {
        return row["Type"] && row["Type"].toLowerCase().trim() === 'planets'; // Filter based on the type
      });
    }
      
    else if (cardType=="asteroids") {
      // Filter for the correct row type (e.g., "stars")
      rows = cachedRows.filter(row => {
        return row["Type"] && row["Type"].toLowerCase().trim() === 'asteroids'; // Filter based on the type
      });
    }

    else if (cardType=="galaxies") {
      // Filter for the correct row type (e.g., "stars")
      rows = cachedRows.filter(row => {
        return row["Type"] && row["Type"].toLowerCase().trim() === 'galaxies'; // Filter based on the type
      });
    }

    else if (cardType=="black_holes") {
      // Filter for the correct row type (e.g., "stars")
      rows = cachedRows.filter(row => {
        return row["Type"] && row["Type"].toLowerCase().trim() === 'black_holes'; // Filter based on the type
      });
    }
  
    // Check if no rows are found
    if (rows.length === 0) {
      console.log('No rows found for type ' + `${cardType}`);
    }
    
  
    // Generate the cards for the filtered rows
    rows.forEach(row => {
      const bodyName = row["Name"]; // Name in the first column
      const imagePath = row["ImagePath"]; // Image Path in the third column
      const brief = row["Brief"]; // Description in the second column
      const sanitizedName = bodyName.replace(/"/g, '\\"').replace(/'/g, "\\'");
  
      const cardHTML = `
        <div class="card zoom-in" onclick="findStar('${sanitizedName}')">
          <div class="card-image" style="background-image: url('${imagePath}');"></div>
          <div class="card-name">${bodyName}</div>
          <div class="card-hover-content">
            <div class="line top-line"></div>
            <div class="description">${brief}</div>
            <div class="line side-line"></div>
          </div>
        </div>
      `;
      
      currentSet.push(cardHTML);  // Add HTML to the current set

        // Push the set into cardSets every time there are 10 cards
        if (currentSet.length === 10) {
            cardSets.push([...currentSet]); // Push a copy of the current set
            currentSet = []; // Reset for the next set
        }
  
    });
  
    // If there are any remaining cards (less than 10), add the last set
    if (currentSet.length > 0) {
      cardSets.push(currentSet);
    }
  
    return cardSets;
  } 
  