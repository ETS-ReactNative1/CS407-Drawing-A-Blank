/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {fireEvent, render, getByText} from '@testing-library/react-native';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import PlayerProfile from '../src/components/leaderboard/playerProfile';
import WorkoutHistory from '../src/components/workout_history/workout_history';

it('User profile renders correctly', () => {
  const props = {
    username: 'test_user',
    gender: 'M',
    weight: '70',
    dob: '2012-12-04',
    height: '1.5',
  };
  const profile = renderer.create(<PlayerProfile props />).toJSON();
  expect(profile).toMatchSnapshot();
});

it('Changing the users weight results in the correct backend API call', () => {
  const mockFn = jest.fn();
  const expectedReq = {
    user: 'test_user',
    weight: 50,
    gender: 'M',
    date_of_birth: '2012-12-04',
    height: '1.5',
  };
  const props = {
    username: 'test_user',
    gender: 'M',
    weight: 70,
    dob: '2012-12-04',
    height: '1.5',
    OnSave: mockFn,
  };
  const {getByPlaceholderText} = render(<PlayerProfile props />);
  // get the weight text input
  const element = getByPlaceholderText('Weight');
  // Change the users weight and press save
  fireEvent.changeText(element, '50');
  fireEvent.press(getByText('Save'));
  expect(mockFn).toBeCalledWith({
    expectedReq,
  });
});

const test_workouts = [
  {
    id: 258,
    date: '2021-04-12T17:54:03.581676Z',
    duration: 988,
    calories: 98,
    type: 'run',
    distance: 1136.3519043457386,
    points: 66,
  },
  {
    id: 318,
    date: '2023-04-25T20:25:06.361558Z',
    duration: 1,
    calories: 0,
    type: 'run',
    distance: 0,
    points: 0,
  },
  {
    id: 258,
    date: '2024-04-12T17:54:03.581676Z',
    duration: 988,
    calories: 98,
    type: 'run',
    distance: 1136.3519043457386,
    points: 66,
  },
  {
    id: 318,
    date: '2025-04-25T20:25:06.361558Z',
    duration: 1,
    calories: 0,
    type: 'walk',
    distance: 0,
    points: 0,
  },
  {
    id: 258,
    date: '2026-04-12T17:54:03.581676Z',
    duration: 988,
    calories: 98,
    type: 'walk',
    distance: 1136.3519043457386,
    points: 66,
  },
];

it('The workout history component should correctly render 5 workouts', () => {
  const mockFn = jest.fn();
  const props = {
    workouts: test_workouts,
  };
  const {getByPlaceholderText} = render(<WorkoutHistory props />);
  // check the workouts exist
  expect(
    getByPlaceholderText('2021-04-12').toBeTruthy() &&
      getByPlaceholderText('2023-04-12').toBeTruthy() &&
      getByPlaceholderText('2024-04-12').toBeTruthy() &&
      getByPlaceholderText('2025-04-12').toBeTruthy() &&
      getByPlaceholderText('2026-04-12').toBeTruthy() &&
      getByPlaceholderText('2026-04-12').toContain('walk') &&
      getByPlaceholderText('2025-04-12').toContain('walk'),
  );
});

it('The workout history component should correctly render 3 workouts when supplied with a date filter', () => {
  const mockFn = jest.fn();
  const props = {
    workouts_test: test_workouts,
    date_test: '2024-04-12',
  };
  const {getByPlaceholderText} = render(<WorkoutHistory props />);
  // check the workouts exist
  expect(
    getByPlaceholderText('2021-04-12').toBeNull() &&
      getByPlaceholderText('2022-04-12').toBeNull() &&
      getByPlaceholderText('2023-04-12').toBeNull(),
  );
});

it('The workout history component should produce an error message when supplied with an invalid date', () => {
  const mockFn = jest.fn();
  const props = {
    workouts_test: test_workouts,
    date_test: '20c4-04-ab',
  };
  const {getByPlaceholderText} = render(<WorkoutHistory props />);
  // check the workouts exist
  expect(getByPlaceholderText.toExist());
});
