import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile, getGivingArray, getRequestingArray } from './reducers';
import { loadProfile, clearProfile } from './actions';
import PictureForm from './PictureForm';
import ContactForm from './ContactForm';
import AvailabilityForm from './AvailabilityForm';
import Shareable from './Shareable';
import { capitalize } from '../../utils/formatters';
import styles from './Profile.css';

class Profile extends PureComponent {
  static propTypes = {
    match: PropTypes.object,
    location: PropTypes.object.isRequired,
    isUser: PropTypes.bool,
    loadProfile: PropTypes.func.isRequired,
    clearProfile: PropTypes.func.isRequired,
    profile: PropTypes.object,
    giving: PropTypes.array,
    requesting: PropTypes.array
  };

  state = {
    editingPicture: false,
    editingContact: false,
    editingAvailability: false
  };

  handleProfileLoad = () => {
    const { match, isUser, loadProfile } = this.props;
    isUser ? loadProfile() : loadProfile(match.params.id);
  };
 
  componentDidMount() {
    this.handleProfileLoad();
  }

  componentDidUpdate({ location }) {
    const locationPreUpdate = location.pathname;
    const locationPostUpdate = this.props.location.pathname;
    if(locationPreUpdate === locationPostUpdate) return;
    this.props.clearProfile();
    this.handleProfileLoad();
  }

  handleFormToggle = key => {
    this.setState(prevState => ({ [key]: !prevState[key] }));
  };

  componentWillUnmount() {
    this.props.clearProfile();
  }

  render() {
    const { profile, giving, requesting, isUser } = this.props;
    const { editingPicture, editingContact, editingAvailability } = this.state;

    if(!profile) return null;

    const { firstName, lastName, pictureUrl, availability, contact } = profile;

    return (
      <section className={styles.profile}>
        <div className="wrapper">
          <div className="name-and-picture">
            <div className="profile-picture" style={pictureUrl && { background: `url(${pictureUrl}) 50% 50% no-repeat` }}>
              {isUser && <button className={editingPicture ? 'editing picture-button' : 'picture-button'} onClick={() => this.handleFormToggle('editingPicture')}>✎</button>}
            </div>
            <h2 className="name">{firstName} {lastName}</h2>
          </div>
          {isUser && editingPicture && <PictureForm onDone={this.handleFormToggle}/>}

          <div className="button-and-heading">
            {isUser && <button className={editingContact ? 'editing' : undefined} onClick={() => this.handleFormToggle('editingContact')}>✎</button>}
            <h4>Reachable at:</h4>
          </div>
          {isUser && editingContact && <ContactForm onDone={this.handleFormToggle}/>}
          <p className="contact-info">{contact}</p>
        
          <div className="button-and-heading">
            {isUser && <button className={editingAvailability ? 'editing' : undefined} onClick={() => this.handleFormToggle('editingAvailability')}>✎</button>}
            <h4>Most Likely to Be Available:</h4>
          </div>
          {isUser && editingAvailability && <AvailabilityForm onDone={this.handleFormToggle}/>}
          <div className="availability-info">
            <ul>
              {availability && availability.days && availability.days.map((item, i) => <li key={i}>{capitalize(item)}</li>)}
            </ul>
            {availability && availability.notes && <p><span className="notes-heading">Notes: </span>{availability.notes}</p>}
          </div>

          <Shareable isUser={isUser} heading="Giving" shareableType="giving" shareable={giving}/>
          <Shareable isUser={isUser} heading="Requesting" shareableType="requesting" shareable={requesting}/>
        
        </div>
      </section>
    );
  }
}

export default connect(
  state => ({
    giving: getGivingArray(state),
    requesting: getRequestingArray(state),
    profile: getProfile(state)
  }),
  { loadProfile, clearProfile }
)(Profile);
