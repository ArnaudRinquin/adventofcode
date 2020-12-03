use std::io;

fn get_fuel_for_mass(mass: u32) -> u32 {
    let fuel:u32 = (mass / 3) - 2;
    return fuel;
}

fn main() {
    let mut total_fuel: u32 = 0;
    loop {
        let mut mass = String::new();
        io::stdin()
            .read_line(&mut mass)
            .expect("Failed to read line");

        let fuel: u32 = match mass.trim().parse() {
            Ok(mass) => get_fuel_for_mass(mass),
            Err(_) => {
                break;
            },
        };
        total_fuel += fuel;

    }
    println!("{}", total_fuel);
}
