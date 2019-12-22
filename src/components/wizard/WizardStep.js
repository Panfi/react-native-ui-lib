import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import View from '../view';
import Text from '../text';
import Image from '../image';
import TouchableOpacity from '../touchableOpacity';
import {PureBaseComponent} from '../../commons';
import Colors from '../../style/colors';
import BorderRadiuses from '../../style/borderRadiuses';
import Spacings from '../../style/spacings';
import {States, StatesConfig} from './WizardStates';

/**
 * @description: WizardStep Component: a wizard presents a series of steps in  prescribed order
 * that the user needs to complete in order to accomplish a goal (e.g. purchase a product).
 *
 * @example: https://github.com/wix-private/wix-react-native-ui-lib/blob/master/example/screens/components/WizardScreen.js
 * @guidelines: https://zpl.io/aXmAkdg
 * @notes: Use Wizard with nested Wizard.Step(s) to achieve the desired result.
 */
export default class WizardStep extends PureBaseComponent {
  static displayName = 'Wizard.Step';

  static propTypes = {
    /**
     * The state of the step (Wizard.States.X)
     */
    state: PropTypes.oneOf(Object.values(States)),
    /**
     * The label of the item
     */
    label: PropTypes.string,
    /**
     * Additional styles for the label
     */
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    /**
     * Additional styles for the connector
     */
    connectorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    /**
     * Color of the step index (or of the icon, when provided)
     */
    color: PropTypes.string,
    /**
     * Color of the circle
     */
    circleColor: PropTypes.string,
    /**
     * Icon to replace the (default) index
     */
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    /**
     * Additional styles for the index's label (when icon is not provided)
     */
    indexLabelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    /**
     * Whether the step should be enabled
     */
    enabled: PropTypes.bool
  };

  getProp(activeConfig, config, propName) {
    const props = this.getThemeProps();
    const {index, activeIndex} = props;

    if (index === activeIndex) {
      return activeConfig[propName];
    } else if (!_.isUndefined(props[propName])) {
      return props[propName];
    } else {
      return config[propName];
    }
  }

  renderCircle(config, activeConfig) {
    const {testID, index, onPress, indexLabelStyle} = this.getThemeProps();
    const hitSlopSize = Spacings.s2;
    const color = this.getProp(activeConfig, config, 'color');
    const circleColor = this.getProp(activeConfig, config, 'circleColor');
    const icon = this.getProp(activeConfig, config, 'icon');
    const enabled = this.getProp(activeConfig, config, 'enabled');

    return (
      <TouchableOpacity
        testID={`${testID}.circle`}
        style={[styles.circle, {borderColor: circleColor}]}
        onPress={enabled ? onPress : undefined}
        hitSlop={{top: hitSlopSize, bottom: hitSlopSize, left: hitSlopSize, right: hitSlopSize}}
        disabled={!enabled}
      >
        {_.isUndefined(icon) ? (
          <Text
            text80
            testID={`${testID}.index`}
            style={[{color}, config.indexLabelStyle, indexLabelStyle, activeConfig.indexLabelStyle]}
          >
            {index + 1}
          </Text>
        ) : (
          <Image testID={`${testID}.image`} source={icon} tintColor={color}/>
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const {
      testID,
      state,
      activeConfig: propsActiveConfig,
      label,
      labelStyle,
      index,
      activeIndex,
      maxWidth,
      connectorStyle
    } = this.getThemeProps();
    const config = StatesConfig[state];
    const activeConfig = index === activeIndex ? propsActiveConfig : {};

    return (
      <View testID={testID} row center flex={index !== activeIndex}>
        {index > activeIndex && (
          <View flex style={[styles.connector, config.connectorStyle, connectorStyle, activeConfig.connectorStyle]}/>
        )}
        {this.renderCircle(config, activeConfig)}
        {index === activeIndex && (
          <Text
            text80
            testID={`${testID}.label`}
            numberOfLines={1}
            style={[styles.label, {maxWidth}, config.labelStyle, labelStyle, activeConfig.labelStyle]}
          >
            {label}
          </Text>
        )}
        {index < activeIndex && <View flex style={[styles.connector, connectorStyle]}/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  connector: {
    borderWidth: 1,
    borderColor: Colors.dark60
  },
  circle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadiuses.br100,
    borderWidth: 1
  },
  label: {
    marginHorizontal: 8,
    color: Colors.dark20
  }
});
