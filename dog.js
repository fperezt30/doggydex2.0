  const dogContainer = document.getElementById("dogContainer");

    // Get dog_id from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const dogId = urlParams.get("dog_id");

    async function fetchDog() {
      try {
        const res = await fetch(`https://dogprofile3.onrender.com/dogs/${dogId}`);
        if (!res.ok) throw new Error("Dog not found");
        const dog = await res.json();
        displayDog(dog);
      } catch (err) {
        dogContainer.innerHTML = `<div class="alert alert-danger">Failed to load dog: ${err.message}</div>`;
      }
    }

    function displayDog(dog) {
      dogContainer.innerHTML = `
        <div class="card mb-4">
          <img src="${dog.dog.photo_url}" class="detail-img" alt="${dog.dog.name}">
          <div class="card-body">
            <h2 class="card-title">${dog.dog.name}</h2>
            <p class="card-text"><strong>Age:</strong> ${dog.dog.age}</p>
            <p class="card-text"><strong>Sex:</strong> ${dog.dog.sex}</p>
            <p class="card-text"><strong>Owner:</strong> ${dog.owner.name}</p>
            <p class="card-text"><strong>Contact:</strong> ${dog.owner.phone} (${dog.owner.preferred_contact})</p>
            <h5>Feeding</h5>
            <p class="card-text">Times: ${dog.feeding.times}<br>Amount: ${dog.feeding.amount}<br>Allergies: ${dog.feeding.allergies} ${dog.feeding.allergies_detail || ""}</p>
            <h5>Walks</h5>
            <p class="card-text">Frequency: ${dog.walks.frequency}<br>Duration: ${dog.walks.duration} min</p>
            <h5>Behavior</h5>
            <p class="card-text">
              Barks at: ${dog.behavior.barks_in_reaction_to}<br>
              Afraid of: ${dog.behavior.afraid_of}<br>
              Remarks: ${dog.behavior.owners_remark}<br>
              Medical: ${dog.behavior.medical_conditions}
            </p>
          </div>
        </div>
      `;
    }

    // Fetch dog details on load
    fetchDog();