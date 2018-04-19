import React, { Component } from 'react';
import { Button, Icon } from 'react-native-elements';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search', 
    tabBarIcon: () => {
      return <Icon name='search' size={30} />
    }   
  };

  constructor() {
    super();
    this.state = {
      restaurantInput: '',
      restaurants: null,
      locations: null,
      returnedRestaurant: null
    }
  }

  componentDidMount = () => {
    this.fetchRestaurants();
  }

  fetchRestaurants = async() => {
    const initialFetch = await fetch(`https://restaurant-res-backend.herokuapp.com/api/v1/restaurants`);
    const restaurants = await initialFetch.json();
    await this.setState({ restaurants });
  }

  updateState = text => {
    this.setState({ restaurantInput: text })
  }

  submitSearch = e => {
    e.preventDefault();
    const { restaurants, restaurantInput } = this.state;
    const returnedRestaurant = restaurants.find(rest => rest.restaurant_name.toLowerCase().includes(restaurantInput.toLowerCase()));
    this.setState({ returnedRestaurant })
    this.getLocations(returnedRestaurant.id)
  }

  getLocations = async(id) => {
    const initialFetch = await fetch(`https://restaurant-res-backend.herokuapp.com/api/v1/restaurants/${id}/restaurant_details`);
    const locations = await initialFetch.json();
    this.setState({ locations });
  }

  render() {
    const { returnedRestaurant, locations } = this.state;
    const restaurantName = returnedRestaurant ? <Text>{returnedRestaurant.restaurant_name}</Text> : null;
    const showLocations = locations ? 
      locations.map(location => {
        return (
          <View>
            <Text>{location.location}</Text>
            <Text>{location.phone_number}</Text>
            <Text>{location.tables_open}</Text>
            <Text>{location.wait_time}</Text>
          </View>
        );
      }) : null;

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput style={styles.input} 
                    placeholder='Search'
                    value={this.state.restaurant}
                    onChangeText={(text) => this.updateState(text)} />
          <Button
                  title="Search"
                  titleStyle={{ fontSize: 10 }}
                  buttonStyle={{
                    backgroundColor: "#680000",
                    width: 80,
                    height: 40,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 25
                  }}
                  containerStyle={{ marginTop: 10 }}
                  onPress={(e) => this.submitSearch(e)}
          />
        </View>
        <View>
          {restaurantName}
          {showLocations}
        </View>
      </View>
    )
  }
};


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    backgroundColor: '#202020',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 40,
    paddingTop: 40
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'grey',
    borderRadius: 25,
    borderWidth: 0.5,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 25,
    width: (Dimensions.get('window').width - 130)
  },
   button: {
     borderWidth: 0.5,
     borderRadius: 25,
     fontSize: 5,
     height: 30,
     width: 60
   }
})

export default SearchScreen;