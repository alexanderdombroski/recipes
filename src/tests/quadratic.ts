// Calculates the zeros of a parabolic function

function quadratic_formuala(a: number, b: number, c: number): [number, number] | string {
    let inside_part: number = b ** 2 - 4 * a * c;
    if (inside_part < 0) {
        return "no real solution";
    } else {
        inside_part = Math.sqrt(inside_part)
        return [(-b + inside_part) / 2 / a, (-b - inside_part) / 2 / a];
    }
}

const a: number = 1;
const b: number = -4;
const c: number = 3;

const zeros: [number, number] | string = quadratic_formuala(a, b, c);
if (Array.isArray(zeros)) {
    zeros.forEach(num => console.log(num));
} else {
    console.log(zeros)
}