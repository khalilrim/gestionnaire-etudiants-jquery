$(document).ready(function () {

  function chargerEtudiants() {
    const data = localStorage.getItem("etudiants");
    return data ? JSON.parse(data) : [];
  }

  function sauvegarderEtudiants(liste) {
    localStorage.setItem(
      "etudiants",
      JSON.stringify(liste)
    );
  }

  let etudiants = chargerEtudiants();

  afficherListe();
  afficherStats();


  $("#btn-ajouter").on(
    "click",
    function () {

      const nom =
        $("#nom")
          .val()
          .trim();

      const note =
        parseFloat(
          $("#note").val()
        );

      if (!nom) {

        afficherErreur(
          "Le nom est obligatoire"
        );

        return;
      }

      if (
        isNaN(note)
        || note < 0
        || note > 20
      ) {

        afficherErreur(
          "La note doit être entre 0 et 20"
        );

        return;
      }

      cacherErreur();

      const etudiant = {

        id: Date.now(),

        nom: nom,

        note: note,

        dateAjout:
          new Date()
            .toLocaleDateString(
              "fr-FR",
              {
                day: "2-digit",
                month: "long",
                year: "numeric"
              }
            )

      };

      etudiants.push(
        etudiant
      );

      sauvegarderEtudiants(
        etudiants
      );

      $("#nom").val("");

      $("#note").val("");

      afficherListe();

      afficherStats();

    }
  );


  $("#nom, #note").on(
    "keydown",
    function (e) {

      if (e.which === 13) {

        $("#btn-ajouter")
          .trigger("click");

      }

    }
  );


  $("#liste-etudiants").on(
    "click",
    ".btn-supprimer",

    function () {

      const id =
        parseInt(
          $(this)
            .closest("li")
            .data("id")
        );

      etudiants =
        etudiants.filter(
          e => e.id !== id
        );

      sauvegarderEtudiants(
        etudiants
      );

      afficherListe();

      afficherStats();

    }
  );


  $("#liste-etudiants").on(
    "click",
    ".btn-modifier",

    function () {

      const $li =
        $(this)
          .closest("li");

      const id =
        parseInt(
          $li.data("id")
        );

      const etudiant =
        etudiants.find(
          e => e.id === id
        );

      $li.find(
        ".etudiant-modifier"
      ).html(`

        <input
          type="number"
          class="input-modifier"
          min="0"
          max="20"
          value="${etudiant.note}"
        >

        <button class="btn-action btn-sauvegarder">
          ✔ Sauver
        </button>

        <button class="btn-action btn-annuler">
          ✖
        </button>

      `);

      $(this).hide();

    }
  );


  $("#liste-etudiants").on(
    "click",
    ".btn-sauvegarder",

    function () {

      const $li =
        $(this)
          .closest("li");

      const id =
        parseInt(
          $li.data("id")
        );

      const nouvelle =
        parseFloat(
          $li.find(
            ".input-modifier"
          ).val()
        );

      if (
        isNaN(nouvelle)
        || nouvelle < 0
        || nouvelle > 20
      ) {

        alert(
          "Note invalide"
        );

        return;

      }

      etudiants =
        etudiants.map(
          e => {

            if (
              e.id === id
            ) {

              e.note =
                nouvelle;

            }

            return e;

          }
        );

      sauvegarderEtudiants(
        etudiants
      );

      afficherListe();

      afficherStats();

    }
  );


  $("#liste-etudiants").on(
    "click",
    ".btn-annuler",

    function () {

      afficherListe();

    }
  );

  $("#btn-effacer-tout").on(
    "click",

    function () {

      if (
        etudiants.length === 0
      ) return;

      if (
        !confirm(
          "Supprimer tous les étudiants ?"
        )
      ) return;

      localStorage.removeItem(
        "etudiants"
      );

      etudiants = [];

      afficherListe();

      afficherStats();

    }
  );

  function afficherListe() {

    const $ul =
      $("#liste-etudiants");

    $ul.empty();

    if (
      etudiants.length === 0
    ) {

      $ul.append(`

        <li class="vide-msg">
          Aucun étudiant enregistré
        </li>

      `);

      return;

    }

    $.each(
      etudiants,

      function (
        index,
        etudiant
      ) {

        let classeNote = "";

        if (
          etudiant.note < 10
        ) {

          classeNote =
            "note-rouge";

        }

        else if (
          etudiant.note < 15
        ) {

          classeNote =
            "note-orange";

        }

        else {

          classeNote =
            "note-vert";

        }

        const $li = $(`

          <li
            class="etudiant-item ${classeNote}"
            data-id="${etudiant.id}"
          >

            <div class="etudiant-info">

              <span class="etudiant-nom">
                ${etudiant.nom}
              </span>

              <span class="etudiant-date">
                Ajouté le ${etudiant.dateAjout}
              </span>

            </div>

            <span class="etudiant-note">
              ${etudiant.note}/20
            </span>

            <div class="etudiant-modifier"></div>

            <div class="etudiant-actions">

              <button class="btn-action btn-modifier">
                Modifier
              </button>

              <button class="btn-action btn-supprimer">
                Supprimer
              </button>

            </div>

          </li>

        `);

        $ul.append(
          $li
        );

      }

    );

  }

  function afficherStats() {

    const $stats =
      $("#stats");

    $stats.empty();

    if (
      etudiants.length === 0
    ) {

      $stats.html(`
        <p>
          Aucun étudiant enregistré
        </p>
      `);

      return;

    }

    const total =
      etudiants.length;

    const notes =
      etudiants.map(
        e => e.note
      );

    const moy =
      (
        notes.reduce(
          (a, b) => a + b,
          0
        ) / total
      ).toFixed(2);

    const max =
      Math.max(
        ...notes
      );

    const min =
      Math.min(
        ...notes
      );

    const reussi =
      etudiants.filter(
        e => e.note >= 10
      ).length;

    $stats.html(`

      <div class="stat-box">
        <div class="stat-val">${total}</div>
        <div class="stat-label">Étudiants</div>
      </div>

      <div class="stat-box">
        <div class="stat-val">${moy}</div>
        <div class="stat-label">Moyenne</div>
      </div>

      <div class="stat-box">
        <div class="stat-val">${max}</div>
        <div class="stat-label">Max</div>
      </div>

      <div class="stat-box">
        <div class="stat-val">${min}</div>
        <div class="stat-label">Min</div>
      </div>

      <div class="stat-box">
        <div class="stat-val">${reussi}</div>
        <div class="stat-label">Réussis</div>
      </div>

    `);

  }


  function afficherErreur(msg) {
    $("#erreur")
      .text(msg)
      .fadeIn(200);
  }

  function cacherErreur() {

    $("#erreur")
      .fadeOut(150);

  }

});