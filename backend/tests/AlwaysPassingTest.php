<?php

namespace App\Tests\Fake;

use PHPUnit\Framework\TestCase;

class AlwaysPassingTest extends TestCase
{
    public function testThisWillAlwaysPass(): void
    {
        $this->assertTrue(true);
    }
}
