<?php

namespace Database\Factories;

use App\Models\DetailKamar;
use Illuminate\Database\Eloquent\Factories\Factory;

class DetailKamarFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DetailKamar::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'idKamar' => $this->faker->numberBetween(1, 10),
            'idPenyewa' => $this->faker->numberBetween(1, 10),
            'TanggalSewa' => $this->faker->date(),
            'TanggalJatuhTempo' => $this->faker->date(),
        ];
    }
}

