import { Chance } from 'chance';
import theme from './theme';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from '@material-ui/core/colors';

const colours = [
    red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange
].map(c => c[500]);

export default function (userId) {
    const chance = new Chance(userId);
    const colour = chance.pickone(colours);
    return {
        backgroundColor: colour,
        color: theme.palette.getContrastText(colour),
    }
}