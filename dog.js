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
      const d = dog.dog;
      const o = dog.owner;
      const p = dog.pricing_data || {};
      const f = dog.feeding || {};
      const w = dog.walks || {};
      const b = dog.behavior || {};
      const m = dog.medical || {};
      const e = dog.emergency || {};

      dogContainer.innerHTML = `
        <div class="card mb-4">
          <img src="${d.photo_url}" class="detail-img" alt="${d.name}">
          <div class="card-body">

            <h2 class="card-title">${d.name}</h2>

            <h5>Profile</h5>
            <p class="card-text">
              Age: ${d.age || "—"}<br>
              Breed: ${d.breed || "—"}<br>
              Sex: ${d.sex || "—"}<br>
              Owner: ${o.name || "—"}<br>
              Contact: ${o.phone || "—"} (${o.preferred_contact || "—"})
            </p>

            <h5>Pricing</h5>
            <p class="card-text">
              Last Price Board: ${p.last_price_boarding || "—"}<br>
              Last Price DayCare: ${p.last_price_day_care || "—"}<br>
              Outstanding Balance: ${p.outstanding_balance || "—"}<br>
            </p>

            <h5>Feeding</h5>
            <p class="card-text">
              Times: ${f.times || "—"}<br>
              Amount: ${f.amount || "—"}<br>
            </p>

            <h5>Walks</h5>
            <p class="card-text">
              Frequency: ${w.frequency || "—"}<br>
              Duration: ${w.duration || "—"} min
            </p>

            <h5>Behavior</h5>
            <p class="card-text">
              Barks at: ${b.barks_in_reaction_to || "—"}<br>
              Afraid of: ${b.afraid_of || "—"}<br>
              Remarks: ${b.owners_remark || "—"}
            </p>

            <h5>Medical</h5>
            <p class="card-text">
              Allergies: ${m.allergies || "—"} ${m.allergies_detail || ""}<br>
              Conditions: ${m.medical_condition || "—"}<br>
            </p>

            <h5>Emergency</h5>
            <p class="card-text">
              Name contact: ${e.emergency_contact || "—"}<br>
              Phone number: ${e.phone_number || "—"}<br>
              Vet name: ${e.vet_name || "—"}<br>
              Vet number: ${e.vet_contact || "—"}<br>
            </p>

          </div>
        </div>
      `;
    }
    // Fetch dog details on load
    fetchDog();