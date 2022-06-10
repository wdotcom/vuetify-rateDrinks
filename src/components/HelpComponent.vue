<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <div>
        <div class="text-h5">Help</div>
        <div>
          <strong>Edit a Party:</strong><br />Look for your party in "Hosting".
          Use the pencil to edit your party.
          <p />
        </div>
        <div>
          <strong>Setting the status of the party:</strong><br />People will be
          unable to request access to your party if you have set it to
          "Completed".
          <p />
        </div>
        <div>
          <strong>Approving guests:</strong><br />Enter the party. Click the
          down arrow beside "Partiers". Click the + image beside any names who
          should be approved. Click the x beside any names who should not be
          approved.
          <p />
        </div>
        <div>
          <strong>Rating a drink:</strong><br />When the host makes the drink
          the "Current Drink", you will be see a thumbs up thumbs down image to
          click.
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
