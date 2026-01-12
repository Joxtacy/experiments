use bevy::{
    prelude::*,
    sprite::{MaterialMesh2dBundle, Mesh2dHandle},
};

#[derive(Resource)]
struct MoveTimer(Timer);

#[derive(Component)]
struct Velocity(u32);

#[derive(Component)]
struct Direction(DirectionEnum);

#[derive(PartialEq)]
enum DirectionEnum {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Component)]
struct Snake {
    segments: Vec<Entity>,
    velocity: Velocity,
    direction: Direction,
}

#[derive(Component)]
struct Apple;

#[derive(Component)]
struct Player(Direction);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .insert_resource(MoveTimer(Timer::from_seconds(0.5, TimerMode::Repeating)))
        .add_systems(Startup, setup)
        .add_systems(Update, player_movement_system)
        .run();
}

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    // 2D orthographic camera
    commands.spawn(Camera2dBundle::default());

    let shape = Mesh2dHandle(meshes.add(Rectangle::new(10.0, 10.0)));

    // let color = Color::hsl(360. * i as f32 / num_shapes as f32, 0.95, 0.7);
    commands.spawn((
        MaterialMesh2dBundle {
            mesh: shape,
            material: materials.add(Color::hsl(69.0, 1.0, 0.5)),
            transform: Transform::from_xyz(0.0, 0.0, 0.0),
            ..default()
        },
        //Player(Direction(DirectionEnum::Up)),
        Snake {
            segments: vec![],
            velocity: Velocity(1),
            direction: Direction(DirectionEnum::Up),
        },
    ));
}

fn player_movement_system(
    time: Res<Time>,
    commands: Commands,
    mut move_timer: ResMut<MoveTimer>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    mut query: Query<(&mut Snake, &mut Transform)>,
) {
    let (mut cube, mut transform) = query.single_mut();

    if keyboard_input.pressed(KeyCode::ArrowUp) && cube.direction.0 != DirectionEnum::Down {
        cube.direction = Direction(DirectionEnum::Up);
    }
    if keyboard_input.pressed(KeyCode::ArrowDown) && cube.direction.0 != DirectionEnum::Up {
        cube.direction = Direction(DirectionEnum::Down);
    }
    if keyboard_input.pressed(KeyCode::ArrowLeft) && cube.direction.0 != DirectionEnum::Right {
        cube.direction = Direction(DirectionEnum::Left);
    }
    if keyboard_input.pressed(KeyCode::ArrowRight) && cube.direction.0 != DirectionEnum::Left {
        cube.direction = Direction(DirectionEnum::Right);
    }

    if !move_timer
        .0
        .tick(time.delta() * cube.velocity.0)
        .just_finished()
    {
        return;
    }

    let movement_distance = 10.0; // * 10.0; // * time.delta_seconds();

    // cube.velocity.0 += 1;

    match cube.direction.0 {
        DirectionEnum::Up => transform.translation.y += movement_distance,
        DirectionEnum::Down => transform.translation.y -= movement_distance,
        DirectionEnum::Left => transform.translation.x -= movement_distance,
        DirectionEnum::Right => transform.translation.x += movement_distance,
    }
}

fn snake_eating_apple_system(mut snake_query: Query<&mut Snake>, apple_query: Query<&Apple>) {
    let mut snake = snake_query.single_mut();
    let apple = apple_query.single();

    if snake.segments.len() > 10 {
        snake.velocity.0 += 1;
    }
}
