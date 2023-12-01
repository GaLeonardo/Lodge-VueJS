const app = Vue.createApp({
  data(){
    return{
      lodgeList: [],
      roomList: [],

      searchText: '',

      brand_name: '',
      check_in: '',
      check_out: '',
      city: '',
      contact_number: '',
      description: '',
      email: '',
      full_address: '',
      pets: '',
      state: '',
      terms_of_service: '',
      zip_code: '',
      average_ratings: '',

      visibleLodgeList: false,
      visibleLodgeDetails: false,
      visibleRooms: false,
      visibleReservationForm: false,
      visibleReservationDetails: false,

      check_in_date: '',
      check_out_date: '',
      numberguests: '',
      reservationprice: '',
      errors: [],

      lodgeId: '',
      roomId: '',


    }
  },

  computed:{
    listResult(){
      if(this.searchText){
        return this.lodgeList.filter(lodge => {
          return lodge.brand_name.toLowerCase().includes(this.searchText.toLowerCase())
        });
      } else {
        return this.lodgeList;
      }
    }
  },

  async mounted(){
    await this.getLodges()
  },

  methods:{
    async getLodgeDetails(lodgeId) {
      this.lodgeId = lodgeId
      this.visibleLodgeList = false;
      this.visibleLodgeDetails = true;

      let response = await fetch(`http://localhost:3000/api/v1/lodges/${lodgeId}/`);
      let data = await response.json();

      console.log(data);   

      this.brand_name = data.brand_name;
      this.check_in = data.check_in;
      this.check_out = data.check_out;
      this.city = data.city;
      this.contact_number = data.contact_number;
      this.description = data.description;
      this.email = data.email;
      this.full_address = data.full_address;
      this.pets = data.pets;
      this.state = data.state;
      this.terms_of_service = data.terms_of_service;
      this.zip_code = data.zip_code;
      this.average_ratings = data.average_ratings;

      console.log(this.lodgeId)
    },

    async getLodges(){
      this.visibleLodgeList = true;
      this.visibleLodgeDetails = false;
      this.visibleRooms = false;

      this.visibleReservationDetails = false;
      this.visibleReservationForm = false;
      this.check_in_date = '';
      this.check_out_date = '';
      this.numberguests = '';
      this.reservationprice = '';
      this.errors = '';
      
      let response = await fetch('http://localhost:3000/api/v1/lodges/');

      let data = await response.json();

      this.lodgeList = [];

      data.forEach(item => {
        var lodge = new Object();

        lodge.id = item.id;
        lodge.brand_name = item.brand_name;
        lodge.city = item.city;
        lodge.description = item.description;
        lodge.full_address = item.full_address;

        this.lodgeList.push(lodge)
      })
    },

    async getRooms(lodgeId){
      
      this.visibleRooms = true;
      this.visibleLodgeList = false;

      let response = await fetch(`http://localhost:3000/api/v1/lodges/${lodgeId}/rooms`);
      let dataRoom = await response.json();

      console.log(dataRoom)

      this.roomList = [];

      dataRoom.forEach(item => {
        var room = new Object();

        room.id = item.id;
        room.name = item.name;
        room.description = item.description;
        room.area = item.area
        room.max_capacity = item.max_capacity;
        room.standard_price = item.standard_price;
        room.hasBathroom = item.service.has_bathroom;
        room.hasBalcony = item.service.has_balcony;
        room.hasAirConditioner = item.service.has_air_conditioner;
        room.hasTV = item.service.has_tv;
        room.hasCloset = item.service.has_closet;
        room.hasVault = item.service.has_vault;
        room.isAccessible = item.service.is_accessible;
        this.roomList.push(room)
        console.log(room)
      })
    },

    async checkRoomAvailable(roomId){
      this.visibleReservationDetails = true;
      let url = `http://localhost:3000/api/v1/lodges/${this.lodgeId}/rooms/${roomId}/pre_reservation/`

      let params = `?start_date=${this.check_in_date}&end_date=${this.check_out_date}&number_guests=${this.numberguests}`;

      let response = await fetch(url + params, {method: "POST"});
      let data = await response.json();
      console.log(data)
      if(data.errors){
        this.errors = data.errors
      } else {
        this.reservationprice = data.total_price
      }
    },

    startReservationForm(roomId){
      this.roomId = roomId;
      this.check_in_date = '';
      this.check_out_date = '';
      this.numberguests = '';
      this.reservationprice = '';
      this.errors = '';
      this.visibleReservationForm = true;
    }
  }
})


app.mount('#app');