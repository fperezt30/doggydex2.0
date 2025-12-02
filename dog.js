  const dogContainer = document.getElementById("dogContainer");

    // Get dog_id from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const dogId = urlParams.get("dog_id");

    async function fetchDog() {
      try {
        const res = await fetch(`https://apidoggydex4.onrender.com/dogs/${dogId}`);
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
            <h5>Profile</h5>
            <p class="card-text">
              Age: ${dog.dog.age}<br>
              Breed: ${dog.dog.breed}<br>
              Sex: ${dog.dog.sex}<br>
              Owner: ${dog.owner.name}<br>
              Contact:${dog.owner.phone} (${dog.owner.preferred_contact})<br>
            </p>
            
            <h5>Pricing</h5>
            <p class="card-text">
              Last Price Board: ${dog.pricing_data.last_price_boarding}<br>
              Last Price DayCare: ${dog.pricing_data.last_price_day_care}<br>
              Last Price DayCare: ${dog.pricing_data.outstanding_balance}<br>
            </p>

            <h5>Feeding</h5>
            <p class="card-text">
              Times: ${dog.feeding.times}<br>
              Amount: ${dog.feeding.amount}<br>
            </p>
            
            <h5>Walks</h5>
            <p class="card-text">
              Frequency: ${dog.walks.frequency}<br>
              Duration: ${dog.walks.duration} min
            </p>
            
            <h5>Behavior</h5>
            <p class="card-text">
              Barks at: ${dog.behavior.barks_in_reaction_to}<br>
              Afraid of: ${dog.behavior.afraid_of}<br>
              Remarks: ${dog.behavior.owners_remark}<br>
            </p>

            <h5>Medical</h5>
            <p class="card-text">
              Allergies: ${dog.medical.allergies} ${dog.medical.allergies_detail || ""}<br>
              Conditions: ${dog.medical.medical_condition}<br>
            </p>

            <h5>Emergency</h5>
            <p class="card-text">
              Name contact: ${dog.emergency.emergency_contact} <br>
              Phone number: ${dog.emergency.phone_number}<br>
              Vet name: ${dog.emergency.vet_name}<br>
              Vet number: ${dog.emergency.vet_contact}<br>
            </p>
          </div>
        </div>
      `;
    }

    // Fetch dog details on load
    fetchDog();