<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <div>
        <div class="text-h5">Help</div>
        <div>
          <strong>Enter a Party:</strong><br />Click
          <q-icon name="meeting_room" color="green" size="sm" /> to enter your
          party.
          <p />
        </div>
        <q-separator />
        <div>
          <strong>Edit or Delete a Party:</strong><br />Look for your party in
          "Hosting".
          <p />
          Use the <q-icon name="edit" color="grey" size="sm" /> to edit your
          party.
          <p />
          Click <q-icon name="delete" color="red" size="sm" /> to delete your
          party. This can not be undone!
          <p />
        </div>
        <q-separator />
        <div>
          <strong>Setting the status of the party:</strong><br />Set it to
          either "Not Started", "In Progress" or "Completed" as applicable.
          <p />
          People will be unable to request access to your party if you have set
          it to "Completed".
          <p />
        </div>
        <q-separator />
        <div>
          <strong>Approving guests:</strong><br />
          Enter the party.
          <q-icon name="meeting_room" color="green" size="sm" />
          <p />
          Click the down arrow beside "Partiers"<q-icon
            name="keyboard_arrow_down"
            color="grey-8"
            size="sm"
          />
          <p />
          Click the <q-icon name="add_task" color="green" size="sm" /> beside
          any names who should be approved.
          <p />
          Click the <q-icon name="delete" color="red" size="sm" /> beside any
          names who should not be approved.
          <p />
        </div>
        <q-separator />
        <div>
          <strong>Rating a drink:</strong><br />When the host activates the
          drink, (<q-icon name="toggle_on" color="green" size="sm" />), you will
          be see <q-icon name="thumbs_up_down" color="green" size="sm" />. Click
          to rate your drink.
          <p />
        </div>
        <q-separator />
        <div>
          <strong>Making a drink visible/invisible:</strong><br />When you
          create a drink, you have the option of making it invisible
          <q-icon name="visibility_off" color="green" size="sm" />) or visible
          (<q-icon name="visibility" color="green" size="sm" />).
          <p />
          If you want to keep your drink a secret from everyone else until you
          are ready to share, make the drink invisible by clicking on the eye.
          <q-icon name="visibility" color="green" size="sm" />
          <p />
          Please note, the host will always be able to see the drink
          information.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "HelpComponent",
};
</script>
