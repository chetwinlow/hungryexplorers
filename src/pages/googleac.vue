<template>
  <div>
      <q-input id='autocomplete' aria-placeholder="Enter a place" type='text' />
  </div> 
</template>

<script>
    export default {
        methods: {
            initAutocomplete() {
                const autocomplete = new google.maps.places.Autocomplete(
                    document.getElementById('autocomplete'),
                    {
                        types: ['establishment'],
                        componentRestrictions: {'country' : ['SG']},
                        fields: ['place_id', 'geometry', 'name']
                    }
                )
                console.log(autocomplete)
            }
        }
    }
</script>
